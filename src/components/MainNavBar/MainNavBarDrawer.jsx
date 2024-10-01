import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Collapse,
} from "@mui/material";
import {
  RiCloseLine, RiArrowDropDownLine, RiArrowDropUpLine
} from "@remixicon/react";

import apiInstance from "../../provider/networkProvider";
import { isEmpty } from "../../provider/utilityProvider";
import classes from "./MainNavBar.module.css";

export default function MainNavBarDrawer({open, onClose}) {
  const navigate = useNavigate();
  const [isCollapseOpen, setIsCollapseOpen] = useState(true);
  const [communityListData, setCommunityListData] = useState();

  const navList = [
    { name: "구인", link: "/recruit" },
    { name: "구직", link: "/job" },
  ];

  useEffect(() => {
    communityListLoader().then((res) => {
      setCommunityListData(res);
    })
  }, []);

  return (
    <Drawer open={open} onClose={onClose}>
      <List sx={{ width: "13rem" }}>
        <div className={classes.navSmMenuTitle}>
          <h3>메뉴</h3>
          <IconButton onClick={onClose}>
            <RiCloseLine />
          </IconButton>
        </div>
        <Divider sx={{ margin: "0.6rem 0" }} />
        {navList.map((item, index) => (
          <ListItemButton
            key={`NAV_DRAWER_LIST_${index}`}
            onClick={() => {
              navigate(item.link);
              onClose();
            }}
          >
            <ListItemText>{item.name}</ListItemText>
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={() => {
            setIsCollapseOpen(!isCollapseOpen);
          }}
        >
          <ListItemText>커뮤니티</ListItemText>
          {isCollapseOpen ? <RiArrowDropUpLine/> : <RiArrowDropDownLine/>}
        </ListItemButton>
        <Collapse 
          in={isCollapseOpen} 
          timeout="auto" 
          unmountOnExit
        >
          <List disablePadding>
            {!isEmpty(communityListData) && communityListData.map((subItem, index) => (
              <ListItemButton 
                sx={{ pl: 4 }} 
                key={`NAV_DRAWER_COLLAPSE_LIST_${index}`}
                onClick={() => {
                  navigate(`/c?b=${subItem.communityBoardId}`, {
                    state: {boardName: subItem.communityBoardName}
                  });
                  onClose();
                }}
              >
                <ListItemText>{subItem.communityBoardName}</ListItemText>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
        <Divider sx={{ margin: "0.6rem 0" }} />
      </List>
    </Drawer>
  );
}

// 커뮤니티 목록 데이터 요청 함수
async function communityListLoader() {
  try {
    const response = await apiInstance.get("/api/v1/community/boards");
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
  }
  return [];
}