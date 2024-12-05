import { useState } from "react";
import { useLocation, useLoaderData, useNavigate } from "react-router-dom";
import {
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
  Card,
  Button,
} from "@mui/material";
import { RiUserLine, RiArrowRightLine } from "@remixicon/react";

import PageContent from "../../components/Common/PageContent";
import TitleBar from "../../components/Common/TitleBar";
import TagList from "../../components/Tag/TagList";
import ImagePopUp from "../../components/Common/ImagePopUp";
import apiInstance from "../../provider/networkProvider";
import { ReadOnlyEditor } from "../../components/Editor/Editor";
import classes from "./Portfolio.module.css";

export default function PortfolioPage() {
  const data = useLoaderData();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const useJobButton = location.state?.useJobButton ?? false;
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [imgPopUpData, setImgPopUpData] = useState(null);

  const handleImgClick = (imgURL) => {
    setImgPopUpData(imgURL);
  };
  const closeImgPopUp = (e) => {
    e.preventDefault();
    setImgPopUpData(null);
  };

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <TitleBar backBtnTarget={-1} title="포트폴리오" />
      {!data ? (
        <PageContent>
          <p>포트폴리오를 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.ptfDescArea}>
            <ReadOnlyEditor content={data.description} />
          </div>
          <div className={classes.ptfTagArea}>
            <TagList tagList={data.tagName} />
          </div>
          <ImageList
            cols={matchDownSm ? 1 : 2}
            gap={10}
            variant="mansory"
            sx={{ padding: "0 1.3rem 1.3rem 1.3rem" }}
          >
            {data.portfolioImageResponseDtoList.map((item, index) => (
              <ImageListItem key={`IMG_${index}`}>
                <img
                  src={`${item.portfolioImageAccessUrl}`}
                  alt={`IMG_${index}`}
                  onClick={() => handleImgClick(item.portfolioImageAccessUrl)}
                />
              </ImageListItem>
            ))}
          </ImageList>
          {useJobButton && (
            <div className={classes.ptfJobBtnRow}>
              {useJobButton && data.recentEmployeePostId != null && (
                <Button variant="contained" color="secondary" onClick={() => navigate(`/job/${data.recentEmployeePostId}`)}>
                  <RiArrowRightLine size={18} style={{ marginRight: "0.4rem" }} />
                  최근 작성 구직글 보기
                </Button>
              )}
            </div>
          )}
          {imgPopUpData !== null && (
            <ImagePopUp
              imgPopUpData={imgPopUpData}
              closeImgPopUp={closeImgPopUp}
            />
          )}
        </>
      )}
    </Card>
  );
}

// 포트폴리오 데이터 요청 함수
export async function PortfolioLoader({ request, params }) {
  const pID = params.portfolioID;
  try {
    const response = await apiInstance.get(`/api/v1/portfolios/${pID}`);
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    //console.error(error.message);
  }
  return null;
}
