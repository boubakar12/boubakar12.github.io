/*
 * main.c
 *  Created on: 04/ 2025
 *      Author: bd453 & jlp378
 */
#include <stdint.h>
#include "MKL46Z4.h"
#include "fsl_i2c.h"
#include "vl53l0x_api.h"


volatile int occupancy_count = 0;
volatile int event_flag = 0;
volatile int last_event_entry = 0;

// PIN
#define SW1 3
#define SW3 12
#define RED_LED 29
#define GREEN_LED 5
#define CAPACITY_LIMIT 15
#define SDA 9
#define SCL 8
#define XSHUT1 4
#define XSHUT2 6
#define GPIO11 12
#define GPIO12 4

#define BUTTON1 4
#define BUTTON2 5

VL53L0X_DEV first_tof;
VL53L0X_DEV second_tof;


// UART
void init_uart(void);
void uart_puts(char *s);
void uart_put_int(int n);

// Sensor for direction
void count_enter(void) {
    __disable_irq();
    occupancy_count++;
    event_flag = 1;
    last_event_entry = 1;
    __enable_irq();
}

void count_exit(void) {
    __disable_irq();
    if (occupancy_count > 0)
    {
        occupancy_count--;
    }
    last_event_entry = 0;
    event_flag = 1;
    __enable_irq();
}

// Hardware TOF sensor -
void pit_timer(void) {
    SIM->SCGC6 |= SIM_SCGC6_PIT_MASK; // Enable clock
    PIT->MCR = 0;                     // Enable PIT

    // 50ms interval: 15,000,000*0.05 = 750,000 cycle
    PIT->CHANNEL[0].LDVAL = 750000 - 1;
    PIT->CHANNEL[0].TCTRL = PIT_TCTRL_TIE_MASK | PIT_TCTRL_TEN_MASK; // Interrupt & Enable
    NVIC_EnableIRQ(PIT_IRQn);
}

void board_init(void) {
    // Enable clock
    SIM->SCGC5 |= (SIM_SCGC5_PORTA_MASK | SIM_SCGC5_PORTC_MASK | SIM_SCGC5_PORTD_MASK | SIM_SCGC5_PORTE_MASK);

    // Configure buttons
    PORTC->PCR[SW1] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK | PORT_PCR_PS_MASK | PORT_PCR_IRQC(0xA);
    PORTC->PCR[SW3] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK | PORT_PCR_PS_MASK | PORT_PCR_IRQC(0xA);
    PTC->PDDR &= ~((1 << SW1) | (1 << SW3));

    // Configure LED
    PORTE->PCR[RED_LED] = PORT_PCR_MUX(1);
    PORTD->PCR[GREEN_LED] = PORT_PCR_MUX(1);
    PTE->PDDR |= (1 << RED_LED);
    PTD->PDDR |= (1 << GREEN_LED);

    //Configure external buttons
    PORTA->PCR[BUTTON1] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK | PORT_PCR_PS_MASK | PORT_PCR_IRQC(0xA);
    PORTA->PCR[BUTTON2] = PORT_PCR_MUX(1) | PORT_PCR_PE_MASK | PORT_PCR_PS_MASK | PORT_PCR_IRQC(0xA);
    PTA->PDDR &= ~((1 << BUTTON1) | (1 << BUTTON2));

    // // Setup Ability to Power On/Off ToF Sensor

    // PORTA->PCR[XSHUT1] = PORT_PCR_MUX(001);
    // PORTC->PCR[XSHUT2] = PORT_PCR_MUX(001);
    // PTA->PDDR |= (1 << XSHUT1);
    // PTC->PDDR |= (1 << XSHUT2);

    // // Setup Interrupts for ToF
    // PORTA->PCR[GPIO11] = PORT_PCR_MUX(001);
    // PORTC->PCR[GPIO12] = PORT_PCR_MUX(001);
    // PORTA->PCR[GPIO11] = PORT_PCR_IRQC(1010);
    // PORTC->PCR[GPIO12] = PORT_PCR_IRQC(1010);
    // PTA->PDDR |= ~(1 << GPIO11);
    // PTC->PDDR |= ~(1 << GPIO12);

    // // Set up ToF

    // PORTC->PCR[SDA] |= PORT_PCR_MUX(010);
    // PORTC->PCR[SCL] |= PORT_PCR_MUX(010);
    // SIM->SCGC4 |= (SIM_SCGC4_I2C0_MASK);

    // I2C_VL53L0X_init();

    // // Make sure to change the I2C address of the second one using VL53L0X_SetDeviceAddress
    // VL53L0X_DEV first_tof = malloc(1 * sizeof(VL53L0X_DEV));
    // VL53L0X_DEV second_tof = malloc(1 * sizeof(VL53L0X_DEV));
    // first_tof->comms_speed_khz = 400;
    // first_tof->comms_type = 0;
    // first_tof->I2cDevAddr = 0x52;

    // second_tof->comms_speed_khz = 400;
    // second_tof->comms_type = 0;
    // second_tof->I2cDevAddr = 0x52;

    // i2c_master_config_t master_config;
    // I2C_MasterGetDefaultConfig(&master_config);
    // master_config.baudRate_Bps = CLOCK_GetFreq(I2C0_CLK_SRC);

    // PTA->PDOR |= (1 << 4);
    // PTC->PDOR |= (1 << 6);

    // I2C_MasterInit(I2C0, &master_config, CLOCK_GetFreq(I2C0_CLK_SRC));

    // I2C_Enable(I2C0, 1);

    // PTC->PDOR |= (1 << 6);
    // VL53L0X_SetDeviceAddress(second_tof, 0x54);
    // second_tof->I2cDevAddr = 0x54;
    // PTA->PDOR |= (1 << 4);
    // VL53L0X_DataInit(first_tof);
    // VL53L0X_DataInit(second_tof);
    // VL53L0X_SetDeviceMode(first_tof, VL53L0X_DEVICEMODE_CONTINUOUS_RANGING);
    // VL53L0X_SetDeviceMode(second_tof, VL53L0X_DEVICEMODE_CONTINUOUS_RANGING);
    // To enable interrupts
    // VL53L0X_SetGpioConfig(first_tof, 0, VL53L0X_DEVICEMODE_CONTINUOUS_RANGING, VL53L0X_GPIOFUNCTIONALITY_THRESHOLD_CROSSED_LOW, VL53L0X_INTERRUPTPOLARITY_LOW); // Not sure if we want high or low threshold, putting high for now
    // VL53L0X_SetGpioConfig(second_tof, 0, VL53L0X_DEVICEMODE_CONTINUOUS_RANGING, VL53L0X_GPIOFUNCTIONALITY_THRESHOLD_CROSSED_LOW, VL53L0X_INTERRUPTPOLARITY_LOW); // Not sure if we want high or low threshold, putting high for now

    // VL53L0X_StartMeasurement(first_tof);
    // VL53L0X_StartMeasurement(second_tof);

    // Enable button Interupt
    NVIC_EnableIRQ(PORTA_IRQn);
    NVIC_EnableIRQ(PORTC_PORTD_IRQn);
}

void init_uart(void) {
    SIM->SCGC4 |= SIM_SCGC4_UART0_MASK;
    SIM->SOPT2 |= SIM_SOPT2_UART0SRC(1); // MCGFLLCLK
    PORTA->PCR[1] = PORT_PCR_MUX(2); // UART0_RX
    PORTA->PCR[2] = PORT_PCR_MUX(2); // UART0_TX
    
    // Baud rate 115200 
    UART0->BDH = 0;
    UART0->BDL = 11; 
    UART0->C2 |= (UART_C2_TE_MASK | UART_C2_RE_MASK);
}


// Interrupt Handler
void PIT_IRQHandler(void) {
    PIT->CHANNEL[0].TFLG = PIT_TFLG_TIF_MASK; // Clear PIT flag

}

void PORTA_IRQHandler(void) {
    if (PORTA->ISFR & (1 << BUTTON1)) {
        count_enter();
        PORTA->ISFR = (1 << BUTTON1);
    }
    if (PORTA->ISFR & (1 << BUTTON2)) {
        count_exit();
        PORTA->ISFR = (1 << BUTTON2);
    }
}

// Handler for the Fallback Buttons
// ISR - port C and D
void PORTC_PORTD_IRQHandler(void) {
    if (PORTC->ISFR & (1 << SW1)) {
        count_enter();
        PORTC->ISFR = (1 << SW1);
    }
    if (PORTC->ISFR & (1 << SW3)) {
        count_exit();
        PORTC->ISFR = (1 << SW3);
    }
}



// UART helper functions
void uart_put_int(int n) {
    char buffer[12]; // Enough for 32-bit int
    int i = 0;
    if (n == 0) {
        uart_puts("0");
        return;
    }
    if (n < 0) {
        uart_puts("-");
        n = -n;
    }
    while (n > 0) {
        buffer[i++] = '0' + (n % 10);
        n /= 10;
    }
    buffer[i] = '\0';
    
    // Reverse the string
    for (int j = i - 1; j >= 0; j--) {
        while (!(UART0->S1 & UART_S1_TDRE_MASK)); // Wait until transmit buffer is empty
        UART0->D = buffer[j];
    }
}



void uart_puts(char *s) {
    while (*s) {
        while (!(UART0->S1 & UART_S1_TDRE_MASK)); // Wait until transmit buffer is empty
        UART0->D = *s++;
    }
}


int main(void) {
    board_init();
    pit_timer();
    init_uart();

    // Initialize  Display and LED start
    //displayDigit() ;
    PTD->PCOR = (1 << GREEN_LED);
    PTE->PSOR = (1 << RED_LED);

    while(1) {
        if (event_flag) {
            __disable_irq();
            int current = occupancy_count;
            int is_entry = last_event_entry;
            event_flag = 0;
            __enable_irq();

            // dashboard output
            if (is_entry) uart_puts("ENTRY:");
            else uart_puts("EXIT:");
            uart_put_int(current);
            uart_puts("\r\n");

            // Update  LED
            if (current < CAPACITY_LIMIT) {
                PTD->PCOR = (1 << GREEN_LED); // not full
                PTE->PSOR = (1 << RED_LED);
            } else {
                PTD->PSOR = (1 << GREEN_LED); // full
                PTE->PCOR = (1 << RED_LED);
            }
        }
    }
}


