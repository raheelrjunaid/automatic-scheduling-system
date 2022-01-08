from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from functions import display_time, generate_day, reduce_time
from employees import employees
from days import days

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sqlitedb.py"
db = SQLAlchemy(app)

employee_working = db.Table("association", db.Column(""))


class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(10), nullable=False)
    last_name = db.Column(db.String(10), unique=True, nullable=False)
    fixed_hours = db.Column(db.Boolean, default=False, nullable=False)
    max_working_days = db.Column(db.Integer, default=5, nullable=False)

    def __repr__(self):
        return f"ID: {self.id} | {self.first_name} {self.last_name}"


class Slot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.Integer, nullable=False)
    end = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(10), default=None, nullable=False)

    def __repr__(self):
        if self.status:
            return f"{self.status.capitalize()} slot: {self.start} - {self.end}"
        else:
            return f"Regular slot: {self.start} - {self.end}"


class Day(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(10))
    employees_working = db.relationship("Employee", secondary=employee_working)


emp_outside_hours = 2
twelve_hour = True

# Schedule employees for every day
for day_number, day in enumerate(days):
    # Add day to store hours row
    generate_day(employees, day, day_number, emp_outside_hours)

# Reduce the working days of overbooked_employees
reduce_time(employees, days, emp_outside_hours)

# Mark person as unscheduled (as an effect of reduce_time) instead of N/A
day_off = []
for day_number, day in enumerate(days):
    day_off.append([])
    for employee in employees:
        if (
            employee.availability[day_number] is not None
            and employee not in day.emp_working
        ):
            day_off[-1].append(employee)

# Display employees in alphabetical order (by name)
employees.sort(key=lambda employee: employee.name)
for employee in employees:
    employee.generate_times(display_time, twelve_hour)


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/employees")
def employees_json():
    return jsonify(employees)


@app.route("/employees/<name>")
def employee_json(name):
    return jsonify()


if __name__ == "__main__":
    app.run(debug=True)
