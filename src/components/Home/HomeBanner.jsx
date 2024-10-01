import classes from "./HomeComponent.module.css";

export default function HomeBanner() {
  return (
    <div className={classes.homeBanner}>
      <p>더욱 멋진 컨텐츠를 향해 달리는</p>
      <p>크리에이터를 위한 만남의 장소</p>
    </div>
  );
}