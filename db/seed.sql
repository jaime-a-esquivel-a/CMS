INSERT INTO department (dpt_name)
VALUES
    ("MARKETING"),
    ("SALES"),
    ("IT SERVICES");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Chief Marketing Officer", 80000, 1),
    ("Chief Sales Officer", 90000, 2),
    ("Chief Information Officer", 95000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Ivan", "Palacios", 1, NULL),
    ("Roberto", "Huerta", 2, NULL),
    ("Jaime", "Esquivel", 3, NULL);

