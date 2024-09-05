import { useRouteLoaderData } from "react-router-dom";
import { ImageList, ImageListItem, useTheme, useMediaQuery, Card } from "@mui/material";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { ReadOnlyEditor } from "../../components/Editor";
import classes from "./Portfolio.module.css";

export default function PortfolioPage({ isFromJobPost = false }) {
  const data = !isFromJobPost
    ? useRouteLoaderData("portfolio-page")
    : useRouteLoaderData("portfolio-in-jobPost");
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    
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
            cols={matchDownMd ? 2 : 4}
            gap={20}
            sx={{ padding: "0 1.3rem 1.3rem 1.3rem" }}
          >
            {data.portfolioImageResponseDtoList.map((item, index) => (
              <ImageListItem key={`IMG_${index}`}>
                <img src={`${item.portfolioImageAccessUrl}`} alt={`IMG_${index}`} />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
    </Card>
  );
}

// 포트폴리오 데이터 요청 함수
export async function portfolioLoader({ request, params }) {
  const pID = params.portfolioID;
  try {
    const response = await apiInstance.get(`/api/v1/portfolios/${pID}`);
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return null;
}
