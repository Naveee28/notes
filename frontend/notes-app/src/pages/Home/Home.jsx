import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Notecard from "../../components/Cards/Notecard";
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from '../../assets/add-note.png';
import NodataImg from '../../assets/no-data.png';

const Home = () => {
    const [openAddEditModal, setOpenEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });
    const [showtoastmessage, setShowToastMessage] = useState({
        isShown: false,
        message: "",
        type: "",
    });
    const [isSearch, setIsSearch] = useState(false);
    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    const handleEdit = (noteDetails) => {
        setOpenEditModal({ isShown: true, data: noteDetails, type: "edit" });
    };

    const showToast = (message, type) => {
        setShowToastMessage({
            isShown: true,
            message,
            type,
        });
    };

    const handleCloseToast = () => {
        setShowToastMessage({
            isShown: false,
            message: "",
            type: "",
        });
    };

    // Get user info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
                console.log(userInfo);
            }
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    // Get all notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.log("An unexpected error has occurred");
        }
    };

    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete(`/delete-note/${noteId}`);
            if (response.data && !response.data.error) {
                showToast("Note deleted successfully", 'delete');
                getAllNotes();
            }
        } catch (error) {
            console.log("An unexpected error has occurred");
        }
    };

    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: { query },
            });
            if (response.data && response.data.notes) {
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const updateisPinned=async(noteData)=>{
            const noteId=noteData._id;
            try{
              const response=await axiosInstance.put("/update-note-pinned/"+noteId,{
              isPinned:!noteId.isPinned,
              });
              if(response.data && response.data.note){
                showToast("Note updated Successfully");
                getAllNotes();
              }
            }
            catch(error){
              console.log(error);
              }
};
    const handleClearSearch=()=>{
        setIsSearch(false);
        getAllNotes();
    }

    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return()=>{};
    }, []);

    return (
        <div>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
            <div className="container mx-auto">
                {allNotes.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {allNotes.map((item) => (
                            <Notecard
                                key={item._id}
                                title={item.title}
                                date={item.createdOn}
                                content={item.content}
                                tags={item.tags}
                                isPinned={item.isPinned}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => deleteNote(item)}
                                onPinNote={() => updateisPinned(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyCard
                        imgSrc={isSearch ? NodataImg : AddNotesImg}
                        message={
                            isSearch
                                ? "No notes found for your search."
                                : "Start creating your first note! Click Add button to note down your thoughts, ideas, and reminders. Let's get started!!"
                        }
                    />
                )}
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue absolute right-10 bottom-10"
                onClick={() => setOpenEditModal({ isShown: true, type: "add", data: null })}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>
            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => setOpenEditModal({ isShown: false, type: "add", data: null })}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => setOpenEditModal({ isShown: false, type: "add", data: null })}
                    getAllNotes={getAllNotes}
                    showtoast={showToast}
                />
            </Modal>
            <Toast
                isShown={showtoastmessage.isShown}
                message={showtoastmessage.message}
                type={showtoastmessage.type}
                onClose={handleCloseToast}
            />
        </div>
    );
};

export default Home;
