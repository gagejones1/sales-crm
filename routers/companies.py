from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


#-------------------------------
#Get Companies Router
#-------------------------------
@router.get("/")
def get_companies(
    industry: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(models.Company)

    if industry is not None:
        query = query.filter(models.Company.industry == industry)

    return query.all()


#-------------------------------
#Create Company Router
#-------------------------------
@router.post("/")
def create_company(
    company: schemas.CompanyCreate,
    db: Session = Depends(get_db)
):
    new_company = models.Company(
        name=company.name,
        industry=company.industry,
        website=company.website
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return new_company


#-------------------------------
#Get Companies by CompanyID Router
#-------------------------------
@router.get("/{company_id}")
def get_company(
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

    return company


#-------------------------------
#Update Company Router
#-------------------------------
@router.patch("/{company_id}")
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


#-------------------------------
#Delete Company Router
#-------------------------------
@router.delete("/{company_id}")
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