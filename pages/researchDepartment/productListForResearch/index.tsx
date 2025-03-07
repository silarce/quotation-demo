import ProductList from "pages/factoryDepartment/productList";
import { useState } from "react";



export default function productListForResearch() {
    const [showIframe, setShowIframe] = useState(true);

    return (
        <div>
            {/* <button onClick={() => setShowIframe(!showIframe)}>廠商查詢</button> */}
            {showIframe && (
                // <iframe
                //     src="/domestic/customer"
                //     style={{ width: '100%', height: '600px', border: 'none' }}
                // ></iframe>
                <ProductList/>
            )}
        </div>
    );
}
