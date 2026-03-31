import { Card, CardContent, Skeleton } from "@mui/material";

const ShowSkeleton = () => {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <Skeleton variant="rectangular" height={220} />

      <CardContent>
        <Skeleton width="80%" />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </CardContent>
    </Card>
  );
};

export default ShowSkeleton;