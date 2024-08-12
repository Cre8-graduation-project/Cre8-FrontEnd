import { Card } from "@mui/material";

export default function HomePostCard() {
  const data = dummyData;

  return (
    <div>
      <h3>최신 글</h3>
      <Card
        elevation={2}  
      >  
        {data.map((item) => (
          <>
            <p>{item.type}</p>
            <p>{item.title}</p>
            <p>{item.comment}</p>
          </>
        ))}
      </Card>
    </div>
  );
}

const dummyData = [
  {
    type: "공모전",
    title: "오늘의 공모전 소식",
    comment: 2
  },
  {
    type: "asdf",
    title: "gawehgarg",
    comment: 3
  },
  {
    type: "waerfaew",
    title: "hjkdaskjbgakre",
    comment: 1
  },
]