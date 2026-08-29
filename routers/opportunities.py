from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import SessionLocal

router=APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

    
#-------------------------------
#Get Opportunities Router
#-------------------------------
@router.get("/")
def get_opportunities(
    stage: str | None = None,
    company_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Opportunity)

    if stage is not None:
        query = query.filter(models.Opportunity.stage == stage)

    if company_id is not None:
        query = query.filter(models.Opportunity.company_id == company_id)

    return query.all()


#-------------------------------
# Create Opportunity Router
#-------------------------------
@router.post("/")
def create_opportunity(
    opportunity: schemas.OpportunityCreate,
    db: Session = Depends(get_db)
):
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


#-------------------------------
# Get Opportunity by ID Router
#-------------------------------
@router.get("/{opportunity_id}")
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


#-------------------------------
# Update Opportunity Router
#-------------------------------
@router.patch("/{opportunity_id}")
def update_opportunity(
    opportunity_id: int,
    updated_opportunity: schemas.OpportunityUpdate,
    db: Session = Depends(get_db)
):
    opportunity = db.query(models.Opportunity).filter(
        models.Opportunity.id ==  opportunity_id
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


#-------------------------------
# Delete Opportunity Router
#-------------------------------
@router.delete("/{opportunity_id}")
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