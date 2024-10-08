import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import "moment/locale/vi";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { z } from "zod";

interface IFormValues {
  datetime: Date;
  quantity: string;
  pump: string;
  revenue: string;
  total: string;
}

const formSchema = z.object({
  datetime: z
    .date()
    .min(new Date("1900-01-01"), "Thời gian phải lớn hơn 01/01/1900")
    .max(new Date("2099-12-31"), "Thời gian phải nhỏ hơn 31/12/2099"),
  quantity: z.preprocess(
    (val) => (val === "" ? NaN : Number(val)),
    z
      .number({ message: "Số lượng lít phải là số" })
      .min(0, { message: "Số lượng lít phải lớn hơn 0" })
      .refine((val) => !isNaN(val), { message: "Số lượng phải là dạng số" })
  ),
  pump: z.string().min(1, "Phải chọn 1 trụ bơm"),
  revenue: z.preprocess(
    (val) => (val === "" ? NaN : Number(val)),
    z
      .number({ message: "Doanh thu phải là số" })
      .min(0, { message: "Doanh thu phải lớn hơn 0" })
      .refine((val) => !isNaN(val), { message: "Doanh thu phải là dạng số" })
  ),
  total: z.preprocess(
    (val) => (val === "" ? NaN : Number(val)),
    z
      .number({ message: "Đơn giá phải là số" })
      .min(0, { message: "Đơn giá phải lớn hơn 0" })
      .refine((val) => !isNaN(val), { message: "Đơn giá phải là số" })
  ),
});

function App() {
  const [formValues, setFormValues] = useState<IFormValues>({
    datetime: new Date(),
    quantity: "",
    pump: "",
    revenue: "",
    total: "",
  });
  const [formErrors, setFormErrors] = useState({
    datetime: "",
    quantity: "",
    pump: "",
    revenue: "",
    total: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (
    field: keyof IFormValues,
    value: IFormValues[keyof IFormValues]
  ) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleSubmit = () => {
    // Validation
    try {
      formSchema.parse(formValues);

      setFormErrors({
        datetime: "",
        quantity: "",
        pump: "",
        revenue: "",
        total: "",
      });
      console.log(formValues);
      setOpen(true);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, curr) => {
          const field = curr.path[0] as keyof IFormValues;
          acc[field] = curr.message;
          return acc;
        }, {} as Record<keyof IFormValues, string>);
        setFormErrors(errors);
        setOpen(true);
      }
    }
  };

  const hasErrors = Object.values(formErrors).some((error) => error !== "");

  return (
    <div className="flex justify-center">
      <div className="w-[800px]">
        <header className="shadow-lg w-full px-8 py-4">
          <div className="flex justify-between">
            <a className="flex justify-center items-center gap-2" href="#">
              <FaArrowLeft /> Đóng
            </a>
            <Button variant="contained" onClick={handleSubmit}>
              Cập nhật
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Nhập giao dịch</h1>
        </header>
        <main className="mt-2 py-4 px-8 w-full flex flex-col gap-4">
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="vi">
            <DateTimePicker
              className="w-full"
              label="Thời gian"
              slotProps={{
                textField: {
                  variant: "filled",
                  InputLabelProps: {
                    shrink: true,
                  },
                  InputProps: {
                    style: {
                      backgroundColor: "white",
                      border: `1px solid ${
                        formErrors.datetime ? "red" : "#e5e7eb"
                      }`,
                      borderRadius: "10px",
                    },
                    disableUnderline: true,
                  },
                  helperText: `${formErrors.datetime || ""}`,
                },
              }}
              defaultValue={moment(new Date())}
              onChange={(value) =>
                handleChange("datetime", value?.toDate() || new Date())
              }
              format="DD/MM/YYYY hh:mm:ss"
              ampm={false}
              views={["year", "month", "day", "hours", "minutes", "seconds"]}
            />
            <FormControl fullWidth error={!!formErrors.quantity}>
              <TextField
                variant="filled"
                label="Số lượng"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  input: {
                    disableUnderline: true,
                    style: {
                      backgroundColor: "white",
                      border: `1px solid ${
                        formErrors.quantity ? "red" : "#e5e7eb"
                      }`,
                      borderRadius: "10px",
                    },
                  },
                }}
                value={formValues.quantity}
                onChange={(event) =>
                  handleChange("quantity", event.target.value)
                }
              />
              {formErrors.quantity && (
                <FormHelperText>{formErrors.quantity}</FormHelperText>
              )}
            </FormControl>
            <FormControl variant="filled" fullWidth error={!!formErrors.pump}>
              <InputLabel shrink id="demo-simple-select-filled-label">
                Trụ
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={formValues.pump}
                onChange={(event) => handleChange("pump", event.target.value)}
                sx={{
                  backgroundColor: "white",
                  border: `1px solid ${formErrors.pump ? "red" : "#e5e7eb"}`,
                  borderRadius: "10px",
                }}
                slotProps={{
                  input: {
                    style: {
                      backgroundColor: "white",
                      border: `1px solid ${
                        formErrors.total ? "red" : "#e5e7eb"
                      }`,
                      borderRadius: "10px",
                    },
                  },
                }}
                disableUnderline
              >
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                  (pump) => (
                    <MenuItem key={pump} value={pump}>
                      {pump}
                    </MenuItem>
                  )
                )}
              </Select>
              {formErrors.pump && (
                <FormHelperText>{formErrors.pump}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="filled"
                label="Doanh thu"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  input: {
                    disableUnderline: true,
                    style: {
                      backgroundColor: "white",
                      border: `1px solid ${
                        formErrors.revenue ? "red" : "#e5e7eb"
                      }`,
                      borderRadius: "10px",
                    },
                  },
                }}
                value={formValues.revenue}
                onChange={(event) =>
                  handleChange("revenue", event.target.value)
                }
                error={!!formErrors.revenue}
              />
              {formErrors.revenue && (
                <FormHelperText error>{formErrors.revenue}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="filled"
                label="Đơn giá"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  input: {
                    disableUnderline: true,
                    style: {
                      backgroundColor: "white",
                      border: `1px solid ${
                        formErrors.total ? "red" : "#e5e7eb"
                      }`,
                      borderRadius: "10px",
                    },
                  },
                }}
                value={formValues.total}
                onChange={(event) => handleChange("total", event.target.value)}
                error={!!formErrors.total}
              />
              {formErrors.total && (
                <FormHelperText error>{formErrors.total}</FormHelperText>
              )}
            </FormControl>
          </LocalizationProvider>
        </main>
      </div>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
      >
        {hasErrors ? (
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
            Đã có lỗi khi nhập form.
          </Alert>
        ) : (
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            Đã nhập giao dịch thành công!
          </Alert>
        )}
      </Snackbar>
    </div>
  );
}

export default App;
