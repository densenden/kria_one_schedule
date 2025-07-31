import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

describe('Card Components', () => {
  it('renders card with content', () => {
    render(
      <Card>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    )
    
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders card with header and title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <CardContent>Content</CardContent>
      </Card>
    )
    
    // The Card component should have the custom class, not the CardContent
    const card = screen.getByText('Content').closest('div').parentElement
    expect(card).toHaveClass('custom-class')
  })

  it('renders card header with correct structure', () => {
    render(
      <CardHeader>
        <CardTitle>Test Title</CardTitle>
        <p>Subtitle</p>
      </CardHeader>
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })
})