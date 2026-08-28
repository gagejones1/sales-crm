from fastapi import FastAPI, Depends, HTTPException

import models 
import schemas

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
    return {"message": "Sales CRM API is running!!"}





# --------------------------------------
# Customer Endpoints
#---------------------------------------

@app.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@app.post("/customers")
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    new_customer = models.Customer(
        name=customer.name,
        email=customer.email,
        active=customer.active
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

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer

@app.patch("/customers/{customer_id}")
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

@app.delete("/customers/{customer_id}")
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





# --------------------------------------
# Company Endpoints
#---------------------------------------

@app.get("/companies")
def get_companies(db: Session = Depends(get_db)):
    return db.query(models.Company).all()

@app.post("/companies")
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    new_company = models.Company(
        name=company.name,
        industry=company.industry,
        website=company.website

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

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    return company 


@app.patch("/companies/{company_id}")
def update_company(
    company_id: int,
    updated_company: schemas.CompanyUpdate,
    db: Session = Depends(get_db)
):
    company = db.query(models.Company).filter(
        models.Company.id == company_id
    ).first()

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    if updated_company.name is not None:
        company.name = updated_company.name

    if updated_company.industry is not None:
        company.industry = updated_company.industry

    if updated_company.website is not None:
        company.website = updated_company.website

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

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    db.delete(company)
    db.commit()

    return {"message": "Company has been deleted!!"}



# --------------------------------------
# Contact Endpoints
#---------------------------------------
@app.get("/contacts")
def get_contacts(db: Session = Depends(get_db)):
    return db.query(models.Contact).all()

@app.post("/contacts")
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    new_contact = models.Contact(
        name=contact.name,
        email=contact.email,
        company_id=contact.company_id
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return new_contact


@app.get("/contacts/{contact_id}")
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id
    ).first()

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )

    return contact


@app.patch("/contacts/{contact_id}")
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

    if updated_contact.name is not None:
        contact.name = updated_contact.name

    if updated_contact.email is not None:
        contact.email = updated_contact.email

    if updated_contact.company_id is not None:
        contact.company_id = updated_contact.company_id

    db.commit()
    db.refresh(contact)

    return contact


@app.delete("/contacts/{contact_id}")
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




# --------------------------------------
# Opportunity Endpoints
#---------------------------------------
@app.get("/opportunities")
def get_opportunities(db: Session = Depends(get_db)):
    return db.query(models.Opportunity).all()


@app.post("/opportunities")
def create_opportunity(opportunity: schemas.OpportunityCreate, db: Session = Depends(get_db)):
    new_opportunity = models.Opportunity(
        name=opportunity.name,
        value=opportunity.value,
        stage=opportunity.stage,
        company_id=opportunity.company_id
    )

    db.add(new_opportunity)
    db.commit()
    db.refresh(new_opportunity)

    return new_opportunity


@app.get("/opportunities/{opportunity_id}")
def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):
    opportunity = db.query(models.Opportunity).filter(
        models.Opportunity.id == opportunity_id
    ).first()

    if opportunity is None:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    return opportunity


@app.patch("/opportunities/{opportunity_id}")
def update_opportunity(
    opportunity_id: int,
    updated_opportunity: schemas.OpportunityUpdate,
    db: Session = Depends(get_db)
):
    opportunity = db.query(models.Opportunity).filter(
        models.Opportunity.id == opportunity_id
    ).first()

    if opportunity is None:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )
    


    if updated_opportunity.name is not None:
        opportunity.name = updated_opportunity.name

    if updated_opportunity.value is not None:
        opportunity.value = updated_opportunity.value

    if updated_opportunity.stage is not None:
        opportunity.stage = updated_opportunity.stage
    
    if updated_opportunity.company_id is not None:
        opportunity.company_id = updated_opportunity.company_id

    db.commit()
    db.refresh(opportunity)

    return opportunity



@app.delete("/opportunities/{opportunity_id}")
def delete_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):
    opportunity = db.query(models.Opportunity).filter(
        models.Opportunity.id == opportunity_id
    ).first()

    if opportunity is None:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    db.delete(opportunity)
    db.commit()

    return {"message": "Opportunity deleted!!"}
