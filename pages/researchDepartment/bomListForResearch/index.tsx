import BomList from "pages/factoryDepartment/bomList";
import { useState } from "react";



export default function bomListForResearch() {
    const [showIframe, setShowIframe] = useState(true);

    return (
        <div>
            {/* <button onClick={() => setShowIframe(!showIframe)}>廠商查詢</button> */}
            {showIframe && (
                // <iframe
                //     src="/domestic/customer"
                //     style={{ width: '100%', height: '600px', border: 'none' }}
                // ></iframe>
                <BomList/>
            )}
        </div>
    );
}
