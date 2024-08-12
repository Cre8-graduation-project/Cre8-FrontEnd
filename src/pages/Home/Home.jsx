import PageContent from "../../components/PageContent";
import HomeBanner from "../../components/Home/HomeBanner";
import HomePostCard from "../../components/Home/HomePostCard";
import classes from "./Home.module.css";
import HomeCategoryList from "../../components/Home/HomeCategoryList";
import HomeRecruitList from "../../components/Home/HomeRecruitList";
import HomeJobList from "../../components/Home/HomeJobList";

export default function HomePage() {
    return <>
      <HomeBanner />
      <div className={classes.homePostArea}>
        <HomePostCard />
        <HomePostCard />
      </div>
      <HomeCategoryList />
      <HomeRecruitList />
      <HomeJobList />
    </>
}