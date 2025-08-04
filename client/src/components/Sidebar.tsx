import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemText } from "@u_ui/u-ui";
import { fetchDatabases } from "../api/database";


export default function Sidebar() {
    const [databases, setDatabases] = useState<string[]>([]);

    useEffect(() => {
        fetchDatabases()
        .then(setDatabases)
        .catch(err => console.error('Error fetching databases:', err));
    }, []);

    return (
        <List>
            {databases.map(db => (
                <ListItem key={db} disablePadding>
                    <ListItemButton component={Link} to={`/db/${db}`}>
                        <ListItemText primary={db} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}