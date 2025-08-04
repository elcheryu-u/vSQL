import Sidebar from "../components/Sidebar";
import TableList from "../components/TableList";
import TableContent from "../components/TableContent";
import QueryEditor from "../components/QueryEditor";

export default function DatabaseView() {

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{display: 'flex', flexGrow: 1}}>
                    <TableList />
                    <TableContent />
                </div>
                <QueryEditor />
            </div>
        </div>
    )
}