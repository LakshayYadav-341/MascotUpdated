import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Image, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@client/components/ui/dialog";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import { Textarea } from "@client/components/ui/textarea";
import { Card, CardContent } from "@client/components/ui/card";

import urls, { basePath } from "@utils/urls";
import { selectSession } from "../auth/authSlice";

const PostOptions = ({ isPostChanged, setIsPostChanged }) => {
  const session = useSelector(selectSession);
  const [postCaption, setPostCaption] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const handleImageChange = (e) => {
    const files = e.target.files;
    setPostImages([...postImages, ...files]);
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      const res = await axios.post(basePath + urls.post.create, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${session.token}`,
        },
      });
      if (res?.status === 200) {
        toast.success("Posted Photo Successfully");
        resetForm();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      const res = await axios.post(basePath + urls.post.create, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${session.token}`,
        },
      });
      if (res?.status === 200) {
        toast.success("Added article Successfully");
        resetForm();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const resetForm = () => {
    setPostCaption("");
    setPostImages([]);
    setPhotoModalOpen(false);
    setArticleModalOpen(false);
    setIsPostChanged(!isPostChanged);
  };

  return (
    <Card className="relative">
      <CardContent>
        <div className="flex items-center justify-around pt-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setPhotoModalOpen(true)}
          >
            <Image className="h-5 w-5" /><p className="text-lg"> Photo</p>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setArticleModalOpen(true)}
          >
            <FileText className="h-5 w-5" /> <p className="text-lg">Write an article</p>
          </Button>
        </div>
      </CardContent>

      {/* Photo Modal */}
      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Photo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePhotoSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What's in your mind
              </label>
              <Input
                name="content.text"
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Image Files
              </label>
              <Input
                type="file"
                name="content.media"
                onChange={handleImageChange}
                multiple
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-secondary"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setPhotoModalOpen(false)}>
                Close
              </Button>
              <Button type="submit">Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Article Modal */}
      <Dialog open={articleModalOpen} onOpenChange={setArticleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write an Article</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleArticleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What's in your mind
              </label>
              <Textarea
                name="content.text"
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setArticleModalOpen(false)}>
                Close
              </Button>
              <Button type="submit">Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PostOptions;