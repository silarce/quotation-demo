import PRequisitionList from "pages/factoryDepartment/PRequisitionList";
import { useState } from "react";



export default function PRequisitionListForResearch() {
    const [showIframe, setShowIframe] = useState(true);

    return (
        <div>
            {showIframe && (
                <PRequisitionList/>
            )}
        </div>
    );
}
