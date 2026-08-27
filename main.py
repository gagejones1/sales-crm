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