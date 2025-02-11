import { useState } from "react";
import { Tree } from "antd";
import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02";

export default function MaterialList() {
    // 存儲選中的 BOM 節點
    const [selectedNode, setSelectedNode] = useState<any>(null);

    const bomData = [
        {
            id: "3BAF0324-A5B3-4CD0-A5DD-A065B5852A23",
            productid: "SJCDP000020201",
            name: "302防颱型門片組",
            spec: "",
            quantity: 1,
            key: "01",
            children: [
                {
                    id: "E6834ED5-EE40-40C5-8ECE-6B47AA928BF4",
                    productid: "SJSDP000010201",
                    name: "SJ-302門片 SST#304",
                    spec: "寬110",
                    quantity: 1,
                    key: "0-0",
                    children: [
                        {
                            id: "D456",
                            productid: "SJCDP000020203",
                            name: "零件 D",
                            spec: "D 規格",
                            quantity: 5,
                            key: "0-0-0"
                        },
                        {
                            id: "E789",
                            productid: "SJCDP000020204",
                            name: "零件 E",
                            spec: "E 規格",
                            quantity: 3,
                            key: "0-0-1"
                        }
                    ]
                },
                {
                    id: "EF140535-7EA3-4EEB-9067-8BA4F62FF16B",
                    productid: "A102-X045000001",
                    name: "不鏽鋼防颱鉤",
                    spec: "4.5MM",
                    quantity: 1,
                    key: "0-1",
                    children: [
                        {
                            id: "F567",
                            productid: "SJCDP000020206",
                            name: "零件 F",
                            spec: "F 規格",
                            quantity: 4,
                            key: "0-1-0"
                        }
                    ]
                }
            ]
        }
    ];

    // 點擊節點時，更新選中的節點資訊
    const handleSelect = (selectedKeys: any, { node }: any) => {
        setSelectedNode(node);
    };

    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={"物料查詢"} panelList={undefined} />
            <div style={{ display: "flex", gap: "20px" }}>
                {/* 左半邊：BOM 樹狀結構 */}
                <div style={{ width: "50%" }}>
                    <Tree
                        treeData={bomData}
                        defaultExpandAll
                        fieldNames={{ title: "name", key: "key", children: "children" }}
                        onSelect={handleSelect} // 當點擊節點時觸發
                    />
                </div>

                {/* 右半邊：顯示選中的 BOM 節點資訊 */}
                <div style={{ width: "50%", border: "1px solid #ddd", padding: "10px" }}>
                    <h3>選中的項目</h3>
                    {selectedNode ? (
                        <div>
                            <p><strong>名稱：</strong> {selectedNode.name}</p>
                            <p><strong>產品編號：</strong> {selectedNode.productid}</p>
                            <p><strong>規格：</strong> {selectedNode.spec || "無"}</p>
                            <p><strong>數量：</strong> {selectedNode.quantity}</p>
                        </div>
                    ) : (
                        <p>請點擊左側樹狀圖選擇一個物料</p>
                    )}
                </div>
            </div>
        </SubLayer>
    );
}
