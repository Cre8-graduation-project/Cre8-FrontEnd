import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ImageList,
  ImageListItem,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { RiMoreFill, RiAddFill } from "@remixicon/react";

import apiInstance from "../../provider/networkProvider";
import classes from "./PortfolioGrid.module.css";

export const PortfolioGrid = ({ memberCode, isEditing = false }) => {
  const navigate = useNavigate();
  const [ptfGridData, setPtfGridData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  // States for Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  // State for Warning Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Run only once
  useEffect(() => {
    reloadGridData();
  }, []);

  const reloadGridData = () => {
    // Load Portfolio list using memberCode
    // Set State to Loading
    setLoadingData(true);
    //setPtfGridData(dummyPortfolioPageData);
    fetchPortfolioGrid(memberCode)
      .then((data) => {
        // Load Portfolio(PTF) Grid Data
        //console.log(data);
        setPtfGridData(data);
      })
      .catch((e) => {
        //console.error(e.message);
      })
      .then(() => {
        // Remove Loading State
        setLoadingData(false);
      });
  };

  // View Portfolio - only available in 'Non-Edit' Page
  const handleImgClick = (e, portfolioID) => {
    if (!isEditing) {
      navigate(`./${portfolioID}`);
    }
  };
  // Context Menu functions - only available in 'Edit' Page
  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = (e, portfolioID) => {
    navigate(`./${portfolioID}`, { state: { isCreation: false }});
  };
  const handleRemove = (e, portfolioID) => {
    removePortfolioPost(portfolioID).then(() => {
      reloadGridData();
    });
  };
  // Add Portfolio - only available in 'Edit' Page
  const handleAddPtf = () => {
    setIsDialogOpen(false);
    // Add Portfolio
    createPortfolioPost().then((ptfID) => {
      navigate(`./${ptfID}`, { state: { isCreation: true }});
    });
  };
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {loadingData && (
        <p className={classes.notiParagraph}>데이터를 불러오는 중입니다.</p>
      )}
      {!loadingData && !ptfGridData && !isEditing && (
        <p className={classes.notiParagraph}>표시할 내용이 없습니다.</p>
      )}
      {!loadingData && (
        <>
          <ImageList cols={3} gap={10}>
            {ptfGridData &&
              ptfGridData.map((item) => (
                <ImageListItem
                  key={item.id}
                  className={
                    !isEditing
                      ? classes.portfolioThumbnail
                      : classes.editThumbnail
                  }
                >
                  <img
                    src={`${item.accessUrl}`}
                    alt={item.id}
                    onClick={(e) => {
                      handleImgClick(e, item.id);
                    }}
                  />
                  {isEditing && (
                    <div>
                      <IconButton
                        aria-label="more"
                        className={classes.moreButton}
                        onClick={handleMenuClick}
                      >
                        <RiMoreFill />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        <MenuItem
                          onClick={(e) => {
                            handleEdit(e, item.id);
                          }}
                        >
                          편집
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={(e) => {
                            handleRemove(e, item.id);
                          }}
                        >
                          삭제
                        </MenuItem>
                      </Menu>
                    </div>
                  )}
                </ImageListItem>
              ))}
            {isEditing && (
              <ImageListItem
                key={"ptfAddBtn"}
                onClick={handleDialogOpen}
                className={classes.ptfAddBtn}
              >
                <RiAddFill />
              </ImageListItem>
            )}
          </ImageList>
          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>{"포트폴리오를 수정 / 생성하시겠습니까?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                저장하지 않은 프로필 내 변경사항은 폐기됩니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} autoFocus>
                취소
              </Button>
              <Button onClick={handleAddPtf}>확인</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

// 포트폴리오 목록 데이터 요청 함수
async function fetchPortfolioGrid(memberCode) {
  try {
    const response = await apiInstance.get(`/api/v1/portfolios/member/${memberCode}`);
    if (response.status === 200) {
      // 조회 성공
      if (response.data.data == "") {
        // 데이터가 비어있으면 null 반환
        return null;
      } else {
        return response.data.data;
      }
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return null;
}

// 포트폴리오 생성 함수
async function createPortfolioPost() {
  try {
    const response = await apiInstance.post(`/api/v1/portfolios`);
    if (response.status === 201) {
      // 생성 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    console.log(error.message);
  }
  return null;
}

// 포트폴리오 삭제 함수
export async function removePortfolioPost(portfolioID) {
  try {
    const response = await apiInstance.delete(`/api/v1/portfolios/${portfolioID}`);
    if (response.status === 200) {
      // 생성 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    console.log(error.message);
  }
  return null;
}