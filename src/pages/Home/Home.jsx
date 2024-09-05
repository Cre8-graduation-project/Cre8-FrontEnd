import PageContent from "../../components/PageContent";
import HomeBanner from "../../components/Home/HomeBanner";
import HomeCommunityCard from "../../components/Home/HomeCommunityCard";
import classes from "./Home.module.css";
import HomeCategoryList from "../../components/Home/HomeCategoryList";
import HomeJobRecruitList from "../../components/Home/HomeJobRecruitList";

export default function HomePage() {
    return <div className={classes.homePage}>
      <HomeBanner />
      <div className={classes.homePostArea}>
        <HomeCommunityCard title="최신 글"/>
        <HomeCommunityCard title="최신 글 2" />
      </div>
      <HomeCategoryList />
      <HomeJobRecruitList dataType="recruit" />
      <HomeJobRecruitList dataType="job" />
    </div>
}