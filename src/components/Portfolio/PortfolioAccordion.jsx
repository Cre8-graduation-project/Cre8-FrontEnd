import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Tab,
  Divider,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { RiArrowDropDownLine } from "@remixicon/react";

import { ReadOnlyEditor } from "../Editor/Editor";
import apiInstance from "../../provider/networkProvider";
import classes from "./PortfolioAccordion.module.css";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<RiArrowDropDownLine size={32} />}
    {...props}
  />
))(({ theme }) => ({
  padding: "0 0.8rem",
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  "& p": {
    fontSize: "1.17em",
    fontWeight: "bold",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .3)',
}));

export default function PortfolioAccordion({ memberCode = -1, memberId = "", portfolioData = [] }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = useState("ptf");
  const [profileData, setProfileData] = useState("");

  useEffect(() => {
    loadProfileIntroduction(memberCode).then((data) => {
      setProfileData(data);
    })
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImgClick = (e, portfolioID) => {
    navigate(`./${portfolioID}`);
  };

  return (
    <Accordion>
      <AccordionSummary>
        <div className={classes.ptfAccordionSummaryBtnRow}>
          <Typography>작성자 정보</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              navigate(`/p/${memberId}`);
            }}
            sx={{ 
              lineHeight: "1.4rem",
              borderRadius: "1rem",
              padding: "4px 16px",
            }}  
          >
            프로필 바로가기
          </Button>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <TabContext value={value}>
          <TabList onChange={handleChange} sx={{ borderBottom: "1px solid rgba(0, 0, 0, .3)" }}>
            <Tab value="ptf" label="포트폴리오" sx={{ padding: "12px 1.3rem" }} />
            <Tab label="" icon={<Divider orientation="vertical"/>} sx={{ maxWidth: "1px", minWidth: "1px", padding: "0.8rem 0" }} disabled />
            <Tab value="int" label="자기소개" sx={{ padding: "12px 1.3rem" }} />
          </TabList>
          <TabPanel value="ptf" sx={{ padding: "1.3rem"}}>
            <ImageList cols={matchDownMd ? 3 : 5 } gap={10}>
              {portfolioData.length > 0 &&
                portfolioData.map((item) => (
                  <ImageListItem
                    key={item.id}
                    className={classes.ptfAccordionThumbnail}
                  >
                    <img
                      src={`${item.accessUrl}`}
                      alt={item.id}
                      onClick={(e) => {
                        handleImgClick(e, item.id);
                      }}
                    />
                  </ImageListItem>
                ))}
              {portfolioData.length == 0 && "표시할 내용이 없습니다."}
            </ImageList>
          </TabPanel>
          <TabPanel value="int">
            <ReadOnlyEditor content={profileData} />
          </TabPanel>
        </TabContext>
      </AccordionDetails>
    </Accordion>
  );
}

async function loadProfileIntroduction(memberCode) {
  try {
    const response = await apiInstance.get(
      `/api/v1/${memberCode}/profile`
    );
    // 프로필 데이터 로드 성공
    if (response.status === 200) {
      return response.data.data.personalStatement;
    }
  } catch (error) {
    //console.log(error.message);
    return "데이터를 불러오는데 실패했습니다.";
  }
}