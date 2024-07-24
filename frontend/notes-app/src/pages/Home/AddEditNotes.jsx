import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';

const AddEditNotes = ({noteData,getAllNotes,type,onClose,showtoast}) => {
  const [title,settitle]=useState(noteData?.title||"");
  const [content,setContent]=useState(noteData?.content||"");
  const [tags,setTags]=useState(noteData?.tags||[]);
  const [error,seterror]=useState(null);
  //add note
  const addNewNote=async()=>{
    try{
      const response=await axiosInstance.post("/add-note",{
        title,
        content,
        tags,
      });
      if(response.data && response.data.note){
        showtoast("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    }
    catch(error){
      if(error.response && error.response.data && error.response.data.message){
        seterror(error.response.data.message);
      }
    }
  }
  //edit note
  const editNote=async()=>{
    const noteId=noteData._id;
    try{
      const response=await axiosInstance.put("/edit-note/"+noteId,{
        title,
        content,
        tags,
      });
      if(response.data && response.data.note){
        showtoast("Note edited Successfully");
        getAllNotes();
        onClose();
      }
    }
    catch(error){
      if(error.response && error.response.data && error.response.data.message){
        seterror(error.response.data.message);
      }
    }
  };
  const handleAddNote=()=>{
    if(!title){
      seterror("Please enter the title");
      return;
    }
    if(!content){
      seterror("Please enter the content");
      return;
    }
    seterror("");
    if(type==="edit"){
      editNote();
    }
    else{
      addNewNote();
    }
  };
  return (
    <div className='relative'>
      <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500' onClick={onClose}>
        <MdClose className='text-xl text-slate-400'/>
      </button>
        <div className='flex flex-col gap-2'>
            <label className='input-label'>Title</label>
            <input
            type='text'
            className='text-2xl text-slate-950 outline-none'
            placeholder='Go to Gym at 5'
            value={title}
            onChange={({target})=>settitle(target.value)}
            />
        </div>
        <div className='flex flex-col gap-2 mt-4'>
          <label className='input-label'>Content</label>
          <textarea
          type='text'
          className='text-sm text-slate-950 outline-none bg-slate-100 pt-2 rounded'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={({target})=>setContent(target.value)}/>
        </div>
        <div className='mt-3'>
          <label className='input-label'>Tags</label>
          <TagInput tags={tags} setTags={setTags}/>
        </div>
        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
        <button className='btn-primary font-medium mt-5 pt-3' onClick={handleAddNote}>
          {type==='edit'?'EDIT':'ADD'}
        </button>
    </div>
  )
}

export default AddEditNotes