from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import SessionLocal

router = APIRouter(
    prefix="/contacts",
    tags=["Contacts"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#-------------------------------
#Get Contacts Router
#-------------------------------
@router.get("/")
def get_contacts(
    company_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Contact)

    if company_id is not None:
        query = query.filter(models.Contact.company_id == company_id)

    return query.all()


#-------------------------------
#Create Contact Router
#-------------------------------
@router.post("/")
def create_contact(
    contact: schemas.ContactCreate,
    db: Session = Depends(get_db)
):
    new_contact = models.Contact(
        name=contact.name,
        email=contact.email,
        company_id=contact.company_id
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return new_contact


#-------------------------------
#Get Contact by ContactID Router
#-------------------------------
@router.get("/{contact_id}")
def get_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id
    ).first()

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )

    return contact


#-------------------------------
#Update Contacts Router
#-------------------------------
@router.patch("/{contact_id}")
def update_contact(
    contact_id: int,
    updated_contact: schemas.ContactUpdate,
    db: Session = Depends(get_db)
):
    contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id
    ).first()

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )

    if updated_contact.name is None:
        contact.name = updated_contact.name
    
    if updated_contact.email is not None:
        contact.email = updated_contact.email

    if updated_contact.company_id is not None:
        contact.company_id = updated_contact.company_id

    db.commit()
    db.refresh(contact)

    return contact


#-------------------------------
#Delte Contact Router
#-------------------------------
@router.delete("/{contact_id}")
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id
    ).first()

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )

    db.delete(contact)
    db.commit()

    return {"message": "Contact deleted!!"}