import PageContent from "../../components/Common/PageContent";
import HomeBanner from "../../components/Home/HomeBanner";
import HomeCommunityCard from "../../components/Home/HomeCommunityCard";
import classes from "./Home.module.css";
import HomeCategoryList from "../../components/Home/HomeCategoryList";
import HomeJobRecruitList from "../../components/Home/HomeJobRecruitList";

export default function HomePage() {
    return <div className={classes.homePage}>
      <HomeBanner />
      <div className={classes.homePostArea}>
        <HomeCommunityCard title="자유게시판" boardID={1}/>
        <HomeCommunityCard title="공모전 게시판" boardID={2} />
      </div>
      <HomeCategoryList />
      <HomeJobRecruitList dataType="recruit" />
      <HomeJobRecruitList dataType="job" />
    </div>
}