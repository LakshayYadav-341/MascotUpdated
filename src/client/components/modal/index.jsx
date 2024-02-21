import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material"

export default function CustomModal({ children, handleSubmit, open, setOpen, title, buttonType, handleClose }) {
    handleClose = handleClose || (() => setOpen(false))
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>{title}</DialogTitle>
            <div
                style={{
                    display: "flex",
                    padding: "0 .5rem",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <DialogContent>
                    {children}
                </DialogContent>
            </div>
            <DialogActions>
                <Button 
                    variant="filled" 
                    color="error" 
                    onClick={handleClose}
                    sx={{
                        color: "#d32f2f",
                        fontWeight: "550"
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    variant="filled" 
                    color="success"
                    // onClick={handleSubmit}
                    sx={{
                        color: "#029ffa"
                    }}
                    type={buttonType || "button"}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}