import PageContent from "../../components/PageContent";
import HomeBanner from "../../components/Home/HomeBanner";
import HomePostCard from "../../components/Home/HomePostCard";
import classes from "./Home.module.css";
import HomeCategoryList from "../../components/Home/HomeCategoryList";
import HomeRecruitList from "../../components/Home/HomeRecruitList";
import HomeJobList from "../../components/Home/HomeJobList";

export default function HomePage() {
    return <div className={classes.homePage}>
      <HomeBanner />
      <div className={classes.homePostArea}>
        <HomePostCard title="최신 글"/>
        <HomePostCard title="최신 글 2" />
      </div>
      <HomeCategoryList />
      <HomeRecruitList />
      <HomeJobList />
    </div>
}