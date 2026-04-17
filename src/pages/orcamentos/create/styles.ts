'use client';
import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  border: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 1.5rem;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
  align-items: start;
`;

export const FlexEndRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const ItemCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
`;

export const TotalBanner = styled.div`
  background: ${({ theme }) => theme.primary900 || '#0e2d5c'};
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
`;

export const SubtotalDisplay = styled.div`
  text-align: right;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #e5e7eb;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.success || '#10b981'};
  transition: color 0.3s ease;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;
