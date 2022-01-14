from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sqlitedb.py"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = b'X\xf8.A\xe2\x80j16+\xae\xde'
db = SQLAlchemy(app)

def reset_employees_db():
    for employee in Employee.query.all():
        db.session.delete(employee)

    db.session.commit()

    employees = [
        ["Rachel", "Greene", False],
        ["Monica", "Gellers", False],
        ["Phoebe", "Hannigan", False],
        ["Joey", "Tribbiani", False],
        ["Chandler", "Bing", False],
        ["Ross", "Geller", False]
    ]

    for employee in employees:
        first_name = employee[0]
        last_name = employee[1]
        fixed_hours = employee[2]
        new_employee = Employee(first_name=first_name, last_name=last_name, fixed_hours=fixed_hours)
        db.session.add(new_employee)

    db.session.commit()

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(10), nullable=False)
    last_name = db.Column(db.String(10), unique=True, nullable=False)
    fixed_hours = db.Column(db.Boolean, default=False, nullable=False)
    max_working_days = db.Column(db.Integer, default=5, nullable=False)
    schedule = db.relationship('Schedule', backref='employee_scheduled', lazy=True)

    def __repr__(self):
        return f"ID: {self.id} | {self.first_name} {self.last_name}"


class Date(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    min_emps_working = db.Column(db.Integer, default=0, nullable=False)
    opening = db.Column(db.Time, nullable=False)
    closing = db.Column(db.Time, nullable=False)
    schedule = db.relationship('Schedule', backref='date', lazy=True)

    def __repr__(self):
        return f"{self.date}, opens at {self.opening}, closes at {self.closing}"


class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.ForeignKey('employee.id'), nullable=False)
    date_id = db.Column(db.ForeignKey('date.id'), nullable=False)
    start = db.Column(db.Time, nullable=False)
    end = db.Column(db.Time, nullable=False)
    # opening, closing, removed, availability, booked
    status = db.Column(db.String(10), default="booked", nullable=False)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/employee/add", methods=["POST"])
def add_employee():
    content_type = request.headers.get('Content-Type')

    if (content_type == 'application/json'):
        data = request.json
        expected_fields = ["fixed_hours", "first_name", "last_name", "max_working_days"]
        validated = True
        for field in expected_fields:
            if not data:
                message = f"{field} not present"
                validated = False
                break
            elif not data[field]:
                message = f"{field} is null"
                validated = False
                break

        if validated:
            first_name = data["first_name"].strip()
            last_name = data["last_name"].strip()
            fixed_hours = True if data["fixed_hours"] else False
            max_working_days = int(data["max_working_days"])
            new_employee = Employee(
                first_name = first_name,
                last_name = last_name,
                fixed_hours = fixed_hours,
                max_working_days = max_working_days
            )
            db.session.add(new_employee)
            db.session.commit()
            message = "Created!"
            return {"data": data, "message": message}
        else:
            return {"data": data, "ERROR": message}
    else:
        return 'Content-Type not supported!'

@app.route("/employee/all", methods=["GET"])
def get_all_employees():
    employees = []
    for employee in Employee.query.all():
        employees.append({
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "fixed_hours": employee.fixed_hours,
            "max_working_days": employee.max_working_days,
        })
    return jsonify(employees)

@app.route("/employee/reset", methods=["GET"])
def reset_employees():
    reset_employees_db()
    print(Employee.query.all())
    employees = []
    for employee in Employee.query.all():
        employees.append({
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "fixed_hours": employee.fixed_hours,
            "max_working_days": employee.max_working_days,
        })
    return jsonify(employees)

if __name__ == "__main__":
    app.run(debug=True)
