import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/DataTable";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { TableCell } from "@/components/ui/table";
import { menuManagementService } from "@/services/menuManagement.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [dateField, setDateField] = useState(null);

  const fetchData = async () => {
    try {
      const menuData = await menuManagementService.getAllMenus();
      if (menuData) {
        console.log(menuData);
        setMenu(menuData);
      }
    } catch (error) {
      console.error("Failed to fetch user menu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Setup React Hook Form
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          food: "",
          ingredients: "",
          price: 40,
          date: new Date().getFullYear(),
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, _id = null) => {
    if (_id) {
      // Editing existing menu
      const menuData = await menuManagementService.editMenu(_id, formData);

      console.log(menuData);

      fetchData();
    } else {
      // Adding new menu
      const menuData = await menuManagementService.createMenu(formData);

      console.log(menuData);

      fetchData();
    }
  };

  const handleDateSelect = (date) => {
    if (dateField) {
      setValue(dateField, date);
      setDateField(null);
    }
  };

  // Handle delete
  const handleDelete = (_id) => {
    setMenu(menu.filter((food) => food._id !== _id));
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: "food",
      label: "Food",
    },
    {
      key: "ingredients",
      label: "Ingredients",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "date",
      label: "Date",
      render: (value) => format(new Date(value), "PP"),
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    const formData = watch();
    return (
      <>
        <TableCell>
          <Input {...register("food")} placeholder="food" className="w-full" />
        </TableCell>
        <TableCell>
          <Input
            {...register("ingredients")}
            placeholder="ingredients"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("price")}
            type="number"
            placeholder="price"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setDateField("date")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date
                  ? format(new Date(formData.date), "PP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.date)}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </TableCell>
      </>
    );
  };

  return (
    <div className="flex mx-auto p-8 m-8">
      <Card className="w-full">
        <CardHeader className="bg-slate-700 text-white py-6">
          <CardTitle className="text-center text-3xl">
            Menu Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={menu}
            onUpdate={handleUpdateData}
            onDelete={handleDelete}
            renderFormRow={renderFormRow}
            formProviders={{
              handleSubmit,
              resetForm,
            }}
            addFormComponent={{
              buttonLabel: (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Food
                </>
              ),
              renderForm: () => renderFormRow(),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManagement;
