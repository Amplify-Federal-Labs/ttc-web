import { useParams } from "react-router";
import { Crud } from "@toolpad/core/Crud";
import { contactsDataSource, contactsCache } from "../data/contacts";
import type { Contact } from "../data/contacts";

export default function EmployeesCrudPage() {
  const { employeeId } = useParams();

  return (
    <Crud<Contact>
      dataSource={contactsDataSource}
      dataSourceCache={contactsCache}
      rootPath="/contacts"
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
      pageTitles={{
        show: `Contact ${employeeId}`,
        create: "New Contact",
        edit: `Contact ${employeeId} - Edit`,
      }}
    />
  );
}
