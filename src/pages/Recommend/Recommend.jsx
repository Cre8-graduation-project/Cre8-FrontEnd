import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Grid, Button, CircularProgress } from "@mui/material";
import { RiAddFill, RiSearchLine } from "@remixicon/react";

import TitleBar from "../../components/Common/TitleBar";
import { Toast } from "../../components/Common/Toast";
import apiInstance from "../../provider/networkProvider";
import { isFileSizeUnderLimit, isEmpty } from "../../provider/utilityProvider";
import classes from "./Recommend.module.css";

export default function RecommendPage() {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recommendData, setRecommendData] = useState([]);

  const CheckImage = (link) => {
    const imageRegex =
      /https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg)(?:\?.*)?$/i;

    if (!imageRegex.test(link)) {
      return false;
    }
    return true;
  };

  const handleAddImg = async (e) => {
    setIsUploading(true);
    if (e.target.type === "file" && e.target.files && e.target.files[0]) {
      if (!isFileSizeUnderLimit(e.target.files[0])) {
        Toast.error("1MB 이하의 이미지만 사용할 수 있습니다.");
      }
      // Fetch Preview Image
      const uploadedImg = e.target.files[0];
      const uploadedImgURL = window.URL.createObjectURL(uploadedImg);
      setImageData(uploadedImgURL);
      try {
        const formData = new FormData();
        formData.append("imageFile", uploadedImg);
        const res = await RecommendRequestWithImage(formData);
        if (res.status == "success") {
          setRecommendData(res.data);
        } else {
          Toast.error("오류가 발생했습니다.");
        }
      } catch (error) {
        Toast.error("오류가 발생했습니다.");
      }
    }
    setIsUploading(false);
  };

  const handleAddImageLink = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    // Check if the link is an image
    if (!CheckImage(imageData)) {
      Toast.error("링크가 이미지 파일이 아닙니다.");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("imageUrl", imageData);
      const res = await RecommendRequestWithImage(formData);
      if (res.status == "success") {
        setRecommendData(res.data);
      } else {
        Toast.error("오류가 발생했습니다.");
      }
    } catch (error) {
      Toast.error("오류가 발생했습니다.");
    }

    setIsUploading(false);
  };

  return (
    <Card
      sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}
      className={classes.recommendContent}
    >
      <TitleBar title="추천" />
      <p className={classes.recommendText}>
        업로드된 이미지를 기반으로 유사한 작업물을 완성한 크리에이터를
        추천해드립니다.
      </p>
      <div
        className={classes.recommendImageArea}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleAddImg(e);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.querySelector("span").style.display = "none";
          e.currentTarget.querySelector("p").textContent =
            "이미지를 놓아서 업로드하세요.";
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          // Prevent the event firing when dragging over children
          if (e.currentTarget.contains(e.relatedTarget)) return;
          e.currentTarget.querySelector("span").style.display = "block";
          e.currentTarget.querySelector("p").textContent =
            "이미지를 드래그 & 드랍하거나 아래 버튼을 눌러 추가하세요.";
        }}
      >
        {!isUploading ? (
          <label htmlFor="recommendImageUploadBtn">
            <div className={classes.recommendUploadedImageArea}>
              {!isEmpty(imageData) && <img src={imageData} alt="postImage" />}
              <div className={classes.recommendUploadedImageAreaText}>
                <p>이미지를 드래그 & 드랍하거나 아래 버튼을 눌러 추가하세요.</p>
                <Button
                  variant="contained"
                  component="span"
                  sx={{ paddingLeft: "10px" }}
                >
                  <RiAddFill size={22} style={{ marginRight: "0.3rem" }} />{" "}
                  이미지 추가
                </Button>
                <p>또는, 아래에서 이미지 링크를 입력할 수도 있습니다.</p>
                <div className={classes.recommendUploadedImageLinkArea}>
                  <input
                    id="recommendImageLinkInput"
                    type="link"
                    placeholder="https://"
                    onChange={(e) => setImageData(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleAddImageLink}>
                    <RiSearchLine size={20} />
                  </Button>
                </div>
              </div>
            </div>
            <input
              id="recommendImageUploadBtn"
              style={{ display: "none" }}
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleAddImg}
            />
          </label>
        ) : (
          <CircularProgress color="inherit" />
        )}
      </div>
      <div className={classes.recommendPortfolioArea}>
        {isEmpty(recommendData) ? (
          <p>표시할 내용이 없습니다.</p>
        ) : (
          <Grid container columns={{ xs: 4, sm: 6 }} spacing={{ xs: 2, sm: 2 }}>
            {recommendData.map((item, index) => (
              <Grid item key={index} xs={2} sm={2}>
                <Card
                  elevation={2}
                  className={classes.recommendPortfolioCard}
                  onClick={() => navigate(`./${item.id}`)}
                >
                  <img src={item.accessUrl} alt="similarPortfolioImage" />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </Card>
  );
}

// 추천 API 요청 함수
async function RecommendRequestWithImage(formData) {
  try {
    const response = await apiInstance({
      method: "post",
      url: "/api/v1/portfolios/ai/recommend",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // 성공
    return response.data;
  } catch (error) {
    // 실패
    //console.error(error.message);
  }
  return [];
}
