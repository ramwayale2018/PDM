import React from 'react';

interface SelectRoleDepartmentProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const SelectRoleDepartment: React.FC<SelectRoleDepartmentProps> = ({
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
}) => {
  const isRoleSelected = selectedRole !== '';
  const isStatusSelected = selectedStatus !== '';

  return (
    <div className="flex mb-4.5 space-x-4 w-full">
      {/* Role dropdown */}
      <div className="w-1/2">
        <label className="mb-2.5 block text-black dark:text-white">Select Role</label>

        <div className="relative z-20 bg-transparent dark:bg-form-input">
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            required
            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
              isRoleSelected ? 'text-black dark:text-white' : ''
            }`}
          >
            <option value="" disabled className="text-body dark:text-bodydark">
              Select Role
            </option>
            <option value="admin" className="text-body dark:text-bodydark">
              Admin
            </option>
            <option value="sales" className="text-body dark:text-bodydark">
              Sales
            </option>
            {/* <option value="team lead" className="text-body dark:text-bodydark">
              Team Lead
            </option> */}
            <option value="designer" className="text-body dark:text-bodydark">
              Designer
            </option>
            <option value="viewer" className="text-body dark:text-bodydark">
              Viewer
            </option>
            {/* <option value="employee" className="text-body dark:text-bodydark">
              Employee
            </option> */}
          </select>

          <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
          </span>
        </div>
      </div>

      {/* Status dropdown */}
      <div className="w-1/2">
        <label className="mb-2.5 block text-black dark:text-white">Select Status</label>

        <div className="relative z-20 bg-transparent dark:bg-form-input">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            required
            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
              isStatusSelected ? 'text-black dark:text-white' : ''
            }`}
          >
            <option value="" disabled className="text-body dark:text-bodydark">
              Select Status
            </option>
            <option value="active" className="text-body dark:text-bodydark">
              Active
            </option>
            <option value="inactive" className="text-body dark:text-bodydark">
              Inactive
            </option>
          </select>

          <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
            {/* SVG Icon */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectRoleDepartment;
