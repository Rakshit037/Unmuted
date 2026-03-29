import { useEffect, useState } from "react";
import API from "../api/axios";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box
} from "@mui/material";
import ComedianModal from "./ComedianModal";
import EditComedianDialog from "./EditComedianDialog";

const ComedianList = () => {
    const [comedians, setComedians] = useState([]);
    const [selected, setSelected] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const fetchData = async () => {
        const res = await API.get("/comedians");
        setComedians(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await API.delete(`/comedians/${id}`);
        setComedians((prev) => prev.filter((c) => c._id !== id));
    };

    return (
        <Grid container spacing={3} mt={2} alignItems="stretch">
            {comedians.map((c) => (
                <Grid item xs={12} sm={6} md={4} key={c._id}>
                    <Card
                        onClick={() => {
                            setSelected(c);
                            setModalOpen(true);
                        }}
                        sx={{
                            cursor: "pointer",
                            height: "100%",
                            width: "300px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            borderRadius: 3
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={`http://localhost:5000/uploads/comedians/${c.image}`}
                            sx={{
                                height: 220,
                                objectFit: "cover"
                            }}
                        />

                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{c.name}</Typography>
                        </CardContent>
                        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelected(c);
                                    setEditOpen(true);
                                }}>
                                Edit
                            </Button>

                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => handleDelete(c._id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Card>
                    <ComedianModal
                        open={modalOpen}
                        handleClose={() => setModalOpen(false)}
                        comedian={selected}
                    />

                    <EditComedianDialog
                        open={editOpen}
                        handleClose={() => setEditOpen(false)}
                        comedian={selected}
                        refresh={fetchData}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ComedianList;