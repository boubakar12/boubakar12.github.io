/*
 * main.c 
 * Author: bd453 & jlp378
 */


#include <stdint.h>
#include "MKL46Z4.h"
#include "lcd.h"
#include "lcd_manage.h"

// PINS
#define SW1             3    // PTC3  — manual entry button
#define SW3            12    // PTC12 — manual exit button
#define RED_LED        29    // PTE29
#define GREEN_LED       5    // PTD5
#define CAPACITY_LIMIT 10

// HW-486 signal: HIGH= beam intact, LOW= beam broken
#define LDR1_PIN        5    // PTC5 
#define LDR2_PIN        4    // PTA4

//  STATE
volatile int occupancy_count  = 0;
volatile int event_flag       = 0;
volatile int last_event_entry = 0;

static uint8_t  beam1_broken = 0;
static uint8_t  beam2_broken = 0;
static uint32_t beam1_tick   = 0;
static uint32_t beam2_tick   = 0;
static uint32_t sys_tick     = 0;
static uint8_t  prev_b1      = 1; 
static uint8_t  prev_b2      = 1;

// FUNCTION PROTOTYPES 
void init_uart(void);
void uart_puts(char *s);
void uart_put_int(int n);

//  COUNT HELPERS
void count_enter(void) {
    __disable_irq();
    occupancy_count++;
    event_flag = 1;
    last_event_entry = 1;
    __enable_irq();
}

void count_exit(void) {
    __disable_irq();
    if (occupancy_count > 0) occupancy_count--;
    event_flag = 1;
    last_event_entry = 0;
    __enable_irq();
}

//  BOARD init 
void board_init(void) {
    __disable_irq();

    // Enable GPIO clocks
    SIM->SCGC5 |= SIM_SCGC5_PORTA_MASK | SIM_SCGC5_PORTC_MASK |
                  SIM_SCGC5_PORTD_MASK  | SIM_SCGC5_PORTE_MASK;

    // Buttons
    PORTC->PCR[SW1] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK |
                      PORT_PCR_PS_MASK | PORT_PCR_IRQC(0xA);
    PORTC->PCR[SW3] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK |
                      PORT_PCR_PS_MASK | PORT_PCR_IRQC(0xA);
    PTC->PDDR &= ~((1<<SW1) | (1<<SW3));
    NVIC_EnableIRQ(PORTC_PORTD_IRQn);

    // LEDs 
    PORTE->PCR[RED_LED]   = PORT_PCR_MUX(1);
    PORTD->PCR[GREEN_LED] = PORT_PCR_MUX(1);
    PTE->PDDR |= (1<<RED_LED);
    PTD->PDDR |= (1<<GREEN_LED);

    // LDR1 
    PORTC->PCR[LDR1_PIN] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK | PORT_PCR_PS_MASK;
    PTC->PDDR &= ~(1<<LDR1_PIN);

    // LDR2
    PORTA->PCR[LDR2_PIN] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK | PORT_PCR_PS_MASK;
    PTA->PDDR &= ~(1<<LDR2_PIN);

    __enable_irq();
}

// PIT: 10ms 
void pit_timer(void) {
    SIM->SCGC6 |= SIM_SCGC6_PIT_MASK;
    PIT->MCR = 0;
    PIT->CHANNEL[0].LDVAL = 480000 - 1;  // 10ms at 48MHz
    PIT->CHANNEL[0].TCTRL = PIT_TCTRL_TIE_MASK | PIT_TCTRL_TEN_MASK;
    NVIC_EnableIRQ(PIT_IRQn);
}

// PIT ISR: beam detection logic
void PIT_IRQHandler(void) {
    PIT->CHANNEL[0].TFLG = PIT_TFLG_TIF_MASK;
    sys_tick++;

    // Read beam states
    uint8_t b1 = (PTC->PDIR >> LDR1_PIN) & 1;
    uint8_t b2 = (PTA->PDIR >> LDR2_PIN) & 1;

    // DEBUG: print every 100 ticks (1 second) 
    // Cehck after to remove it; just checking the LCD and serial output
    if (sys_tick % 100 == 0) {
        uart_puts("B1:");
        uart_put_int(b1);
        uart_puts(" B2:");
        uart_put_int(b2);
        uart_puts("\n");
    }


    // Detect falling edge (beam just broken)
    if (prev_b1==1 && b1==0) {
        beam1_broken = 1;
        beam1_tick   = sys_tick;
    }
    if (prev_b2==1 && b2==0) {
        beam2_broken = 1;
        beam2_tick   = sys_tick;
    }

    // Timeout: reset if beam blocked for more than 3 seconds
    if (beam1_broken && (sys_tick - beam1_tick) > 300) beam1_broken = 0;
    if (beam2_broken && (sys_tick - beam2_tick) > 300) beam2_broken = 0;

    // Both beams restored after both being broken = person passed
    if (b1==1 && b2==1 && beam1_broken && beam2_broken) {
        if (beam1_tick <= beam2_tick)
            count_enter();  
        else
            count_exit();    

        beam1_broken = 0;
        beam2_broken = 0;
    }

    prev_b1 = b1;
    prev_b2 = b2;
}

// BUTTON ISR 
void PORTC_PORTD_IRQHandler(void) {
    if (PORTC->ISFR & (1<<SW1)) {
        count_enter();
        PORTC->ISFR = (1<<SW1);
    }
    if (PORTC->ISFR & (1<<SW3)) {
        count_exit();
        PORTC->ISFR = (1<<SW3);
    }
}


// Check the code;
// UART
void init_uart(void) {
    SIM->SCGC4 |= SIM_SCGC4_UART0_MASK;
    SIM->SOPT2 |= SIM_SOPT2_UART0SRC(2);  
    PORTA->PCR[1] = PORT_PCR_MUX(2);      
    PORTA->PCR[2] = PORT_PCR_MUX(2);     
    UART0->C2 &= ~(UART_C2_TE_MASK | UART_C2_RE_MASK);
    UART0->BDH = 0;
    UART0->BDL = 4;                     
    UART0->C2 |= (UART_C2_TE_MASK | UART_C2_RE_MASK);
}



void uart_put_int(int n) {
    char buf[12]; int i = 0;
    if (n==0) { uart_puts("0"); return; }
    if (n<0)  { uart_puts("-"); n=-n; }
    while (n>0) { buf[i++] = '0'+(n%10); n/=10; }
    for (int j=i-1; j>=0; j--) {
        while (!(UART0->S1 & UART_S1_TDRE_MASK));
        UART0->D = buf[j];
    }
}

void uart_puts(char *s) {
    while (*s) {
        while (!(UART0->S1 & UART_S1_TDRE_MASK));
        UART0->D = *s++;
    }
}

// MAIN 
int main(void) {
    setup_lcd();
    board_init();
    pit_timer();
    init_uart();

    PTD->PCOR = (1<<GREEN_LED);
    PTE->PSOR = (1<<RED_LED);
    displayDigit(4, 0);
    update_lcd(0);
    uart_puts("LASER READY\n");

    while (1) {
        if (event_flag) {
            __disable_irq();
            int current  = occupancy_count;
            int is_entry = last_event_entry;
            event_flag   = 0;
            __enable_irq();

            update_lcd(current);
            displayDigit(4, current % 10);
            if (current >= 10) displayDigit(3, (current/10) % 10);

            if (is_entry) uart_puts("ENTRY:");
            else          uart_puts("EXIT:");
            uart_put_int(current);
            uart_puts("\n");

            if (current < CAPACITY_LIMIT) {
                PTD->PCOR = (1<<GREEN_LED);
                PTE->PSOR = (1<<RED_LED);
            } else {
                PTD->PSOR = (1<<GREEN_LED);
                PTE->PCOR = (1<<RED_LED);
            }
        }
    }
}
