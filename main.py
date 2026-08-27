from fastapi import FastAPI, Depends

import models 
from database import engine, SessionLocal

from sqlalchemy.orm import Session 

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home(): 
    return {"message" : "Sales CRM API is running!!"}


customers =[
    {"id": 1, "name": "Apple"},
    {"id": 2, "name": "Microsoft"}
]
    




# --------------------------------------
# Customer Endpoints
#---------------------------------------

@app.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@app.post("/customers")
def create_customer(customer: dict, db: Session = Depends(get_db)):
    new_customer = models.Customer(
        name=customer["name"],
        email=customer["email"],
        active=customer.get("active", True)
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@app.get("/customers/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    return customer

@app.patch("/customers/{customer_id}")
def update_customer(
    customer_id: int,
    updated_customer: dict,
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if "name" in updated_customer:
        customer.name = updated_customer["name"]

    if "email" in updated_customer:
        customer.email = updated_customer["email"]

    if "active" in updated_customer:
        customer.active = updated_customer["active"]

    db.commit()
    db.refresh(customer)

    return customer

@app.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    db.delete(customer)
    db.commit()

    return {"message": "Customer has been deleted!"}





# --------------------------------------
# Company Endpoints
#---------------------------------------

@app.get("/companies")
def get_companies(db: Session = Depends(get_db)):
    return db.query(models.Company).all()

@app.post("/companies")
def create_company(company: dict, db: Session = Depends(get_db)):
    new_company = models.Company(
        name=company["name"],
        industry=company.get("industry"),
        website=company.get("website")

    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return new_company

@app.get("/companies/{company_id}")
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(
        models.Company.id == company_id
    ).first()

    return company 


@app.patch("/companies/{company_id}")
def update_company(
    company_id: int,
    updated_company: dict,
    db: Session = Depends(get_db)
):
    company = db.query(models.Company).filter(
        models.Company.id == company_id
    ).first()

    if "name" in updated_company:
        company.name = updated_company["name"]

    if "industry" in updated_company:
        company.industry = updated_company["industry"]

    if "website" in updated_company:
        company.website = updated_company["website"]

    db.commit()
    db.refresh(company)

    return company


@app.delete("/companies/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db)
):
    company = db.query(models.Company).filter(
        models.Company.id == company_id
    ).first()

    db.delete(company)
    db.commit()

    return {"message": "Company has been deleted!!"}