import React, { useState } from 'react';
import './SideBar.css'; // Import your CSS file
import VendorRegistration from '../Pages/VendorRegistration';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [open, setOpen] = React.useState(false);
    const [canditateOpen, setCanditateOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open);
    };

    const handleCanditate = () => {
        setCanditateOpen(!canditateOpen)
    }
    const navigate = useNavigate()
    return (
        <aside id="sidebar" class="sidebar">

            <ul class="sidebar-nav" id="sidebar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <i class="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <List className="nav-item">
                    <ListItemButton onClick={handleClick}>

                        <ListItem className='list-item-main'>Vendors</ListItem>
                        {open ? <ExpandLess className='expand-icon' /> : <ExpandMore className='expand-icon' />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding className='list-box'>

                            <ListItem className='list-item' onClick={() => navigate("/dashboard/register-vendor")}>Vendor Registration</ListItem>
                            <ListItem className='list-item' onClick={() => navigate("/dashboard/vendor-list")}>Get All Vendor</ListItem>



                        </List>
                    </Collapse>

                </List>


                <List className="nav-item">
                    <ListItemButton onClick={handleCanditate}>

                        <ListItem className='list-item-main'>Candidates</ListItem>
                        {canditateOpen ? <ExpandLess className='expand-icon' /> : <ExpandMore className='expand-icon' />}
                    </ListItemButton>
                    <Collapse in={canditateOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding className='list-box'>

                            <ListItem className='list-item' onClick={() => navigate("/dashboard/register-caditate")}>Register Candidates</ListItem>
                            <ListItem className='list-item'>Get All Candidates</ListItem>


                        </List>
                    </Collapse>

                </List>






                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <i class="bi bi-plus-circle"></i>
                        <span>Add Skills</span>
                    </a>
                </li>
            </ul>




        </aside>
    );
}

export default Sidebar;
