// service/callTrayService.tsx
//呼叫托盤
export const callTray = async (
    baseURL: string,
    deviceName: string,
    trayname: string,
    trayCommand: string,
    regAddress: string,
    cmdValue: string
) => {
    try {
        // 呼叫 traycommand API
        const trayCommandResponse = await fetch(
            `${baseURL}Modbus/traycommand/${deviceName}/${trayname}?traycommand=${trayCommand}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!trayCommandResponse.ok) {
            throw new Error("Failed to call traycommand API");
        }

        // 等待一秒
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 呼叫 execcommand API
        const execCommandResponse = await fetch(
            `${baseURL}Modbus/execcommand/${deviceName}/${regAddress}/${cmdValue}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!execCommandResponse.ok) {
            throw new Error("Failed to call execcommand API");
        }
    } catch (error: any) {
        console.error("Error in callTray:", error.message);
        throw error; // 向外層拋出錯誤
    }
};

// service/callTrayService.tsx

// 更新托盤呼叫狀態
export const updateTrayStatus = async (
    apipath: string,
    conditionModel: {
        whid: string;
        called: boolean;
        trayname: string;
        called_by: string | undefined;
    }
) => {
    try {
        const inputModel = {
            TypeName: "ERP",
            ServiceName: "WareHouseService",
            FunctionName: "no",
            FilterConditions: JSON.stringify(conditionModel),
        };

        const response = await fetch(`${apipath}/WareHouse/UpdateTrayStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputModel),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        return result; // 回傳結果供主檔案處理
    } catch (error) {
        console.error("Error in updateTrayStatus:", error);
        throw error; // 將錯誤拋出供外層處理
    }
};

// 取得托盤呼叫狀態
export const getTrayStatus = async (
    apipath: string,
    whid: string
): Promise<{ called: boolean; ip: string; trayname: string, whname: string }> => { // 加入 trayname
    try {
        const conditionModel = { whid };

        const inputModel = {
            TypeName: "ERP",
            ServiceName: "WareHouseService",
            FunctionName: "GetTrayStatus",
            FilterConditions: JSON.stringify(conditionModel),
        };

        const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
        const response = await fetch(`${apipath}/WareHouse/GetTrayStatus?${queryParams}`);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const trayStatus = await response.json();
        return trayStatus; // 保持回傳所有資料
    } catch (error) {
        console.error("Error in getTrayStatus:", error);
        throw error; // 將錯誤拋出供外層處理
    }
};

