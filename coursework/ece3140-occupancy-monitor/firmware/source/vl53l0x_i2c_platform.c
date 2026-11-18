/*
 * COPYRIGHT (C) STMicroelectronics 2015. All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * STMicroelectronics ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with STMicroelectronics
 *
 * Programming Golden Rule: Keep it Simple!
 *
 */

/*!
 * \file   VL53L0X_platform.c
 * \brief  Code function defintions for Ewok Platform Layer
 *
 */


#include <stdio.h>    // sprintf(), vsnprintf(), printf()

#include "vl53l0x_i2c_platform.h"
#include "vl53l0x_def.h"

#include "vl53l0x_platform_log.h"

#include "fsl_i2c.h"
#include "MKL46Z4.h"

#ifdef VL53L0X_LOG_ENABLE
#define trace_print(level, ...) trace_print_module_function(TRACE_MODULE_PLATFORM, level, TRACE_FUNCTION_NONE, ##__VA_ARGS__)
#define trace_i2c(...) trace_print_module_function(TRACE_MODULE_NONE, TRACE_LEVEL_NONE, TRACE_FUNCTION_I2C, ##__VA_ARGS__)
#endif




#define MIN_COMMS_VERSION_MAJOR     1
#define MIN_COMMS_VERSION_MINOR     8
#define MIN_COMMS_VERSION_BUILD     1
#define MIN_COMMS_VERSION_REVISION  0

#define STATUS_OK              0x00
#define STATUS_FAIL            0x01

i2c_master_handle_t g_m_handle;

volatile uint8_t nakFlag		= 0;
volatile uint8_t completionFlag = 0;

void i2c_master_callback(I2C_Type *base, i2c_master_handle_t *handle, status_t status, void *userData) {
    if (status == kStatus_Success) {
        completionFlag = true;
    }
    if ((status == kStatus_I2C_Nak) || (status == kStatus_I2C_Addr_Nak)) {
        nakFlag = true;
    }
}

static void i2c_release_bus_delay(void)
{
    uint32_t i = 0;
    for (i = 0; i < 100U; i++)
    {
        __NOP();
    }
}

void I2C_VL53L0X_init(void){
    I2C_MasterTransferCreateHandle(I2C0, &g_m_handle, i2c_master_callback, NULL);
}

int32_t VL53L0X_comms_initialise(uint16_t comms_speed_khz)
{
    I2C_MasterTransferCreateHandle(I2C0, &g_m_handle, i2c_master_callback, NULL);

    i2c_master_config_t master_config;
    I2C_MasterGetDefaultConfig(&master_config);

    master_config.baudRate_Bps = 400000;

    PTA->PDOR |= (1 << 4);
    PTC->PDOR |= (1 << 4);

    I2C_MasterInit(I2C0, &master_config, CLOCK_GetFreq(I2C0_CLK_SRC));

    I2C_Enable(I2C0, 1);

    return 0;
}

int32_t VL53L0X_comms_close(void)
{

    I2C_Enable(I2C0, 0);

    I2C_MasterDeinit(I2C0);

    PTA->PCOR |= (1 << 4);
    PTC->PCOR |= (1 << 4);

    return 0;
}

int32_t VL53L0X_write_multi(uint8_t address, uint8_t index, uint8_t *pdata, int32_t count)
{

#ifdef VL53L0X_LOG_ENABLE
    int32_t i = 0;
    char value_as_str[VL53L0X_MAX_STRING_LENGTH_PLT];
    char *pvalue_as_str;

    pvalue_as_str =  value_as_str;

    for(i = 0 ; i < count ; i++)
    {
        sprintf(pvalue_as_str,"%02X", *(pdata+i));

        pvalue_as_str += 2;
    }
    trace_i2c("Write reg : 0x%04X, Val : 0x%s\n", index, value_as_str);
#endif

    uint8_t buff[2] = {index, *pdata};
    
    i2c_master_transfer_t masterTransfer;                   // Make Transfer Struct
    memset(&masterTransfer,0,sizeof(masterTransfer));

    masterTransfer.slaveAddress     = address;           // Init Transfer
    masterTransfer.direction        = kI2C_Write;            
    masterTransfer.subaddress       = index;
    masterTransfer.subaddressSize   = 1;
    masterTransfer.data             = buff;
    masterTransfer.dataSize					= 2;
    masterTransfer.flags            = kI2C_TransferDefaultFlag;
    
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    while ( (!nakFlag) && (!completionFlag) ); // Busy Wait for Signal

    nakFlag = 0;

    if (completionFlag == 1)
    {
        completionFlag = 0;
        return 0;
    }

    return -1; // Transmission failed 
}

int32_t VL53L0X_read_multi(uint8_t address, uint8_t index, uint8_t *pdata, int32_t count)
{

#ifdef VL53L0X_LOG_ENABLE
    int32_t      i = 0;
    char   value_as_str[VL53L0X_MAX_STRING_LENGTH_PLT];
    char *pvalue_as_str;
#endif

    i2c_master_transfer_t masterTransfer;
    memset(&masterTransfer, 0, sizeof(masterTransfer));
	
    masterTransfer.slaveAddress   = address;
    masterTransfer.direction      = kI2C_Read;
    masterTransfer.subaddress     = index;
    masterTransfer.subaddressSize = 1;
    masterTransfer.data           = pdata;
    masterTransfer.dataSize       = count;
    masterTransfer.flags          = kI2C_TransferDefaultFlag;

    // Begin Byte(s) read operation 
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    /*  wait for transfer completed. */
    while ((!nakFlag) && (!completionFlag))
    {
    }

    nakFlag = 0;

    if (completionFlag == true)
    {
        completionFlag = 0;
        return 0; // Transmission Suceeded
    }
    else
    {
        return -1; // Transmission Failed
    }
}


int32_t VL53L0X_write_byte(uint8_t address, uint8_t index, uint8_t data)
{
        uint8_t buff[2] = {index, data};
    
    i2c_master_transfer_t masterTransfer;                   // Make Transfer Struct
    memset(&masterTransfer,0,sizeof(masterTransfer));

    masterTransfer.slaveAddress     = address;           // Init Transfer
    masterTransfer.direction        = kI2C_Write;            
    masterTransfer.subaddress       = index;
    masterTransfer.subaddressSize   = 1;
    masterTransfer.data             = buff;
    masterTransfer.dataSize					= 2;
    masterTransfer.flags            = kI2C_TransferDefaultFlag;
    
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    while ( (!nakFlag) && (!completionFlag) ); // Busy Wait for Signal

    nakFlag = 0;

    if (completionFlag == 1)
    {
        completionFlag = 0;
        return 0;
    }

    return -1; // Transmission failed 

}


int32_t VL53L0X_write_word(uint8_t address, uint8_t index, uint16_t data)
{

    uint8_t  buffer[BYTES_PER_WORD];

    // Split 16-bit word into MS and LS uint8_t
    buffer[0] = (uint8_t)(data >> 8);
    buffer[1] = (uint8_t )(data &  0x00FF);
    
    uint8_t buff[2] = {index, *buffer};
    
    i2c_master_transfer_t masterTransfer;                   // Make Transfer Struct
    memset(&masterTransfer,0,sizeof(masterTransfer));

    masterTransfer.slaveAddress     = address;           // Init Transfer
    masterTransfer.direction        = kI2C_Write;            
    masterTransfer.subaddress       = index;
    masterTransfer.subaddressSize   = 1;
    masterTransfer.data             = buff;
    masterTransfer.dataSize					= 2;
    masterTransfer.flags            = kI2C_TransferDefaultFlag;
    
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    while ( (!nakFlag) && (!completionFlag) ); // Busy Wait for Signal

    nakFlag = 0;

    if (completionFlag == 1)
    {
        completionFlag = 0;
        return 0;
    }

    return -1; // Transmission failed 

}


int32_t VL53L0X_write_dword(uint8_t address, uint8_t index, uint32_t data)
{
    uint8_t  buffer[BYTES_PER_DWORD];

    // Split 32-bit word into MS ... LS bytes
    buffer[0] = (uint8_t) (data >> 24);
    buffer[1] = (uint8_t)((data &  0x00FF0000) >> 16);
    buffer[2] = (uint8_t)((data &  0x0000FF00) >> 8);
    buffer[3] = (uint8_t) (data &  0x000000FF);

    uint8_t buff[2] = {index, *buffer};
    
    i2c_master_transfer_t masterTransfer;                   // Make Transfer Struct
    memset(&masterTransfer,0,sizeof(masterTransfer));

    masterTransfer.slaveAddress     = address;           // Init Transfer
    masterTransfer.direction        = kI2C_Write;            
    masterTransfer.subaddress       = index;
    masterTransfer.subaddressSize   = 1;
    masterTransfer.data             = buff;
    masterTransfer.dataSize					= 2;
    masterTransfer.flags            = kI2C_TransferDefaultFlag;
    
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    while ( (!nakFlag) && (!completionFlag) ); // Busy Wait for Signal

    nakFlag = 0;

    if (completionFlag == 1)
    {
        completionFlag = 0;
        return 0;
    }

    return -1; // Transmission failed

}


int32_t VL53L0X_read_byte(uint8_t address, uint8_t index, uint8_t *pdata)
{
    i2c_master_transfer_t masterTransfer;
    memset(&masterTransfer, 0, sizeof(masterTransfer));
	
    masterTransfer.slaveAddress   = address;
    masterTransfer.direction      = kI2C_Read;
    masterTransfer.subaddress     = index;
    masterTransfer.subaddressSize = 1;
    masterTransfer.data           = pdata;
    masterTransfer.dataSize       = 1;
    masterTransfer.flags          = kI2C_TransferDefaultFlag;

    // Begin Byte(s) read operation 
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    /*  wait for transfer completed. */
    while ((!nakFlag) && (!completionFlag))
    {
    }

    nakFlag = 0;

    if (completionFlag == true)
    {
        completionFlag = 0;
        return 0; // Transmission Suceeded
    }
    else
    {
        return -1; // Transmission Failed
    }

}


int32_t VL53L0X_read_word(uint8_t address, uint8_t index, uint16_t *pdata)
{
	uint8_t  buffer[BYTES_PER_WORD];

    i2c_master_transfer_t masterTransfer;
    memset(&masterTransfer, 0, sizeof(masterTransfer));
	
    masterTransfer.slaveAddress   = address;
    masterTransfer.direction      = kI2C_Read;
    masterTransfer.subaddress     = index;
    masterTransfer.subaddressSize = 1;
    masterTransfer.data           = buffer;
    masterTransfer.dataSize       = 2;
    masterTransfer.flags          = kI2C_TransferDefaultFlag;

    // Begin Byte(s) read operation 
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    /*  wait for transfer completed. */
    while ((!nakFlag) && (!completionFlag))
    {
    }

    nakFlag = 0;

    if (completionFlag == true)
    {
        completionFlag = 0;
        return 0; // Transmission Suceeded
    }
    else
    {
        return -1; // Transmission Failed
    }

	*pdata = ((uint16_t)buffer[0]<<8) + (uint16_t)buffer[1];

}

int32_t VL53L0X_read_dword(uint8_t address, uint8_t index, uint32_t *pdata)
{
	uint8_t  buffer[BYTES_PER_DWORD];
    i2c_master_transfer_t masterTransfer;
    memset(&masterTransfer, 0, sizeof(masterTransfer));
	
    masterTransfer.slaveAddress   = address;
    masterTransfer.direction      = kI2C_Read;
    masterTransfer.subaddress     = index;
    masterTransfer.subaddressSize = 1;
    masterTransfer.data           = buffer;
    masterTransfer.dataSize       = 4;
    masterTransfer.flags          = kI2C_TransferDefaultFlag;

    // Begin Byte(s) read operation 
    I2C_MasterTransferNonBlocking(I2C0, &g_m_handle, &masterTransfer);

    /*  wait for transfer completed. */
    while ((!nakFlag) && (!completionFlag))
    {
    }

    nakFlag = 0;

    if (completionFlag == true)
    {
        completionFlag = 0;
        return 0; // Transmission Suceeded
    }
    else
    {
        return -1; // Transmission Failed
    }

    *pdata = ((uint32_t)buffer[0]<<24) + ((uint32_t)buffer[1]<<16) + ((uint32_t)buffer[2]<<8) + (uint32_t)buffer[3];

}


int32_t VL53L0X_set_gpio(uint8_t level)
{
    int32_t status = STATUS_OK;
    //status = VL53L0X_set_gpio_sv(level);
#ifdef VL53L0X_LOG_ENABLE
    trace_i2c("// Set GPIO = %d;\n", level);
#endif

    return status;

}


int32_t VL53L0X_get_gpio(uint8_t *plevel)
{
    int32_t status = STATUS_OK;
#ifdef VL53L0X_LOG_ENABLE
    trace_i2c("// Get GPIO = %d;\n", *plevel);
#endif
    return status;
}


int32_t VL53L0X_release_gpio(void)
{
    int32_t status = STATUS_OK;
#ifdef VL53L0X_LOG_ENABLE
    trace_i2c("// Releasing force on GPIO\n");
#endif
    return status;

}

int32_t VL53L0X_cycle_power(void)
{
#ifdef VL53L0X_LOG_ENABLE
    trace_i2c("// cycle sensor power\n");
#endif
    PTA->PCOR |= (1 << 4);
    PTC->PCOR |= (1 << 4);

    PTA->PDOR |= (1 << 4);
    PTC->PDOR |= (1 << 4);

	return 0;
}


int32_t VL53L0X_get_timer_frequency(int32_t *ptimer_freq_hz)
{
       *ptimer_freq_hz = 0;
       return STATUS_FAIL;
}


int32_t VL53L0X_get_timer_value(int32_t *ptimer_count)
{
       *ptimer_count = 0;
       return STATUS_FAIL;
}
