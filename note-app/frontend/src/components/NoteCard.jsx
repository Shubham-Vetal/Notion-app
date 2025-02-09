import React, { useState } from "react";
import { Star, Trash2, Edit2, Check, X, Clock, Copy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert, AlertDescription } from "../components/ui/Alert";

const NoteCard = ({
  note = {
    _id: "",
    title: "",
    content: "",
    timestamp: new Date(),
    type: "text",
    isFavorite: false,
  },
  onDelete = () => {},
  onToggleFavorite = () => {},
  onUpdate = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title || "");
  const [editedContent, setEditedContent] = useState(note.content || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSave = () => {
    if (!editedTitle.trim() || !editedContent.trim()) return;

    onUpdate(note._id, {
      title: editedTitle.trim(),
      content: editedContent.trim(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(note.title || "");
    setEditedContent(note.content || "");
    setIsEditing(false);
  };

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleCopyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(note.content).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    });
  };

  return (
    <Card className="w-full bg-white shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 mr-2"
              placeholder="Note title"
            />
          ) : (
            <h3 className="text-lg font-semibold">{note.title}</h3>
          )}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(note._id)}
              className={note.isFavorite ? "text-yellow-500" : "text-gray-400"}
            >
              <Star className="h-4 w-4" />
            </Button>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
          />
        ) : (
          <p className="text-gray-600 whitespace-pre-wrap line-clamp-3">
            {note.content}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          {formatDate(note.timestamp)}
          {note.type === "audio" && (
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
              Audio Note
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyToClipboard}
            className={copySuccess ? "text-green-500" : "text-gray-500"}
          >
            <Copy className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-500">
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSave} className="text-green-500">
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            showDeleteConfirm ? (
              <Alert className="bg-red-50 p-2 rounded-lg">
                <AlertDescription className="flex items-center gap-2">
                  <span className="text-sm">Delete note?</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)} className="text-gray-500">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(note._id)} className="text-red-500">
                    <Check className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
