import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String , required: true},
    password: {type:String, required: true},
    DoB: {type: Date, required: false},
    token:{type: String, required: false},
    mobile: {type: String, required: true}
});

interface Employee extends Document{
    name: String,
    email: String,
    password: String,
    DoB: Date,
    token: String,
    mobile: String
};

const EmployeeModel = mongoose.model<Employee>('Employee', employeeSchema);

export default EmployeeModel;