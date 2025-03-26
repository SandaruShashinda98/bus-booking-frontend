import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

const DataTable = ({
  columns,
  data,
  onUpdate,
  onDelete,
  renderFormRow,
  addFormComponent,
  formProviders = {},
  enableActions = true,
}) => {
  // Internal state for tracking which row is being edited
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Handle edit button click
  const handleEdit = (item) => {
    setEditingId(item._id);
    // Reset form if a resetForm function is provided
    if (formProviders.resetForm) {
      formProviders.resetForm(item);
    }
  };

  // Handle save edit
  const handleSaveEdit = (formData) => {
    onUpdate(formData, editingId);
    setEditingId(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => setEditingId(null);

  // Handle delete
  const handleDelete = (_id) => onDelete(_id);

  // Handle form submission for adding new item
  const handleSaveNew = (formData) => {
    onUpdate(formData);
    setIsAdding(false);
  };

  // Toggle add form visibility
  const toggleAddForm = () => {
    setIsAdding(!isAdding);
    // Reset form if a resetForm function is provided
    if (formProviders.resetForm) {
      formProviders.resetForm({});
    }
  };

  // Common action buttons component
  const ActionButtons = ({ onSave, onCancel }) => (
    <TableCell className="text-right">
      <Button
        size="sm"
        variant="ghost"
        onClick={onSave}
        className="mr-2 bg-white"
        title="Save"
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCancel}
        className="mr-2 bg-white"
        title="Cancel"
      >
        <XCircle className="h-4 w-4" />
      </Button>
    </TableCell>
  );

  return (
    <>
      {addFormComponent && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={toggleAddForm}
            disabled={editingId !== null || isAdding}
          >
            {addFormComponent.buttonLabel}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Add new row */}
            {isAdding && addFormComponent && (
              <TableRow>
                {renderFormRow ? (
                  <>
                    {renderFormRow(
                      null,
                      () => {
                        if (formProviders.handleSubmit) {
                          return formProviders.handleSubmit(handleSaveNew)();
                        }
                        handleSaveNew({});
                      },
                      () => setIsAdding(false)
                    )}
                    <ActionButtons
                      onSave={() => {
                        if (formProviders.handleSubmit) {
                          formProviders.handleSubmit(handleSaveNew)();
                        } else {
                          handleSaveNew({});
                        }
                      }}
                      onCancel={() => setIsAdding(false)}
                    />
                  </>
                ) : (
                  <>
                    {addFormComponent.renderForm(
                      () => {
                        if (formProviders.handleSubmit) {
                          return formProviders.handleSubmit(handleSaveNew)();
                        }
                        handleSaveNew({});
                      },
                      () => setIsAdding(false)
                    )}
                    <ActionButtons
                      onSave={() => {
                        if (formProviders.handleSubmit) {
                          formProviders.handleSubmit(handleSaveNew)();
                        } else {
                          handleSaveNew({});
                        }
                      }}
                      onCancel={() => setIsAdding(false)}
                    />
                  </>
                )}
              </TableRow>
            )}

            {/* Rows for existing data */}
            {data.map((item) =>
              editingId === item._id && enableActions ? (
                // Edit mode
                <TableRow key={`edit-row-${item._id}`}>
                  {renderFormRow ? (
                    <>
                      {renderFormRow(
                        item,
                        () => {
                          if (formProviders.handleSubmit) {
                            formProviders.handleSubmit(handleSaveEdit)();
                          } else {
                            handleSaveEdit(item);
                          }
                        },
                        handleCancelEdit
                      )}
                      <ActionButtons
                        onSave={() => {
                          if (formProviders.handleSubmit) {
                            formProviders.handleSubmit(handleSaveEdit)();
                          } else {
                            handleSaveEdit(item);
                          }
                        }}
                        onCancel={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <>
                      {columns.map((column) => (
                        <TableCell key={`edit-${item._id}-${column.key}`}>
                          {column.renderEdit ? (
                            column.renderEdit(item[column.key], item)
                          ) : (
                            <span>{item[column.key]}</span>
                          )}
                        </TableCell>
                      ))}
                      <ActionButtons
                        onSave={() => {
                          if (formProviders.handleSubmit) {
                            formProviders.handleSubmit(handleSaveEdit)();
                          } else {
                            handleSaveEdit(item);
                          }
                        }}
                        onCancel={handleCancelEdit}
                      />
                    </>
                  )}
                </TableRow>
              ) : (
                // Display mode
                <TableRow key={`display-row-${item._id}`}>
                  {columns.map((column) => (
                    <TableCell key={`${item._id}-${column.key}`}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                      disabled={editingId !== null || isAdding}
                      className="mr-2 bg-white"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item._id)}
                      disabled={editingId !== null || isAdding}
                      className="mr-2 bg-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DataTable;
