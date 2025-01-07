import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import urls, { basePath } from '../../../utils/urls';
import { useGetter } from '../../hooks/fetcher';
import { selectSession } from '../auth/authSlice';
import { toast } from 'react-toastify';

const EditNewsModal = ({ show, handleClose, newsData, session }) => {
    const [editedTitle, setEditedTitle] = useState(newsData.title);
    const [editedDescription, setEditedDescription] = useState(newsData.description);
    const newsUpdateUrl = basePath + urls.news.update.replace(':id', newsData._id);
    const newsDeleteUrl = basePath + urls.news.delete.replace(':id', newsData._id);

    const handleSaveChanges = async () => {
        const res = await axios.put(newsUpdateUrl, {
            title: editedTitle,
            description: editedDescription
        }, {
            headers: { authorization: `Bearer ${session.token}` }
        });
        if (res?.status === 200) {
            toast.success("Edited News Successfully");
            handleClose();
        } else {
            toast.error("Something went wrong!!");
        }
    };

    const handleDelete = async () => {
        const res = await axios.delete(newsDeleteUrl, {
            headers: { authorization: `Bearer ${session.token}` }
        });
        if (res?.status === 200) {
            toast.error("Deleted News Successfully");
            handleClose();
        } else {
            toast.error("Something went wrong!!");
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h5 className="text-lg font-semibold text-gray-100">Edit News</h5>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-300">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                    />
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-gray-300 rounded hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-blue-600 text-gray-300 rounded hover:bg-blue-700 transition-colors"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const NewsCard = () => {
    const newsCreateUrl = basePath + urls.news.create;
    const newsGetUrl = basePath + urls.news.find;
    const { data: newsData, mutate: newsMutate } = useGetter(newsGetUrl);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editnews, setEditnews] = useState(null);
    const [newNewsInput, setNewNewsInput] = useState("");
    const [newNewsTitle, setNewNewsTitle] = useState("");
    const session = useSelector(selectSession);

    const handleAddNews = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const res = await axios.post(newsCreateUrl, {
            title: data.get("title"),
            description: data.get("description") || ""
        }, {
            headers: { authorization: `Bearer ${session.token}` }
        });
        if (res?.status === 200) {
            toast.success("Added News Successfully");
            handleAddModalClose();
        } else {
            toast.error("Something went wrong!!");
        }
    };

    const handleEditClick = (news) => {
        setEditnews(news);
        setShowEditModal(true);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setEditnews(null);
        newsMutate();
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
        setNewNewsInput("");
        setNewNewsTitle("");
        newsMutate();
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl p-4">
                    <div className="space-y-4">
                        {newsData?.data?.length > 0 ? (
                            newsData.data.map((eachNews, index) => (
                                <div key={index} className="border-t border-gray-700 pt-4 first:border-0 first:pt-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-100 mb-2">{eachNews.title}</h4>
                                            <p className="text-gray-400">{eachNews.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleEditClick(eachNews)}
                                            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                                        >
                                            <span className="material-symbols-rounded">edit</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h3 className="text-gray-300 text-center py-4">No News Added Yet</h3>
                        )}
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-gray-300 rounded hover:bg-blue-700 transition-colors"
                    >
                        Add
                    </button>
                </div>
            </div>

            {editnews && (
                <EditNewsModal
                    show={showEditModal}
                    newsData={editnews}
                    handleClose={handleEditModalClose}
                    session={session}
                />
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
                        <form onSubmit={handleAddNews}>
                            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                                <h5 className="text-lg font-semibold text-gray-100">Add News</h5>
                                <button
                                    type="button"
                                    onClick={handleAddModalClose}
                                    className="text-gray-400 hover:text-gray-300"
                                >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <input
                                    type="text"
                                    value={newNewsTitle}
                                    onChange={(e) => setNewNewsTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    placeholder="Title"
                                    name="title"
                                    required
                                />
                                <textarea
                                    value={newNewsInput}
                                    onChange={(e) => setNewNewsInput(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    placeholder="Description"
                                    name="description"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={handleAddModalClose}
                                    className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-gray-300 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Add News
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsCard;