export default async function fetchData(
  idUser: string,
  sessionID: string,
  tableName: string,
  action: "select" | "create" | "update" | "delete",
  where: object,
  data1: object,
  include: object
) {
  try {
    const response = await fetch("/api/database/DB_executeSQL", {
      method: "POST",
      body: JSON.stringify({
        idUser: idUser,
        sessionID: sessionID,
        tableName: tableName,
        action: action,
        where: where,
        data: data1,
        include: include,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
