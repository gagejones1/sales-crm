from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


#-------------------------------
#Get Customers Router
#-------------------------------
@router.get("/")
def get_customers(
    name: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Customer)

    if name is not None:
        query = query.filter(models.Customer.name.ilike(f"%{name}%"))

    return query.all()


#-------------------------------
#Create Customers Router
#-------------------------------
@router.post("/")
def create_customer(
    customer: schemas.CustomerCreate,
    db: Session = Depends(get_db)
):

    new_customer = models.Customer(
        name=customer.name,
        email=customer.email,
        active=customer.active
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


#-------------------------------
#Get Customers by CustomerID Router
#-------------------------------
@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )
    return customer


#-------------------------------
#Update Customers Router
#-------------------------------
@router.patch("/{customer_id}")
def update_customer(
    customer_id: int,
    updated_customer: schemas.CustomerUpdate,
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    if updated_customer.name is not None:
        customer.name = updated_customer.name

    if updated_customer.email is not None:
        customer.email = updated_customer.email

    if updated_customer.active is not None:
        customer.active = updated_customer.active

    db.commit()
    db.refresh(customer)

    return customer 


#-------------------------------
#Delete Customers Router
#-------------------------------
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {"message": "Customer has been deleted!"}