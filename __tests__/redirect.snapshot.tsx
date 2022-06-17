import { render } from '@testing-library/react'
import Redirect from '../pages/redirect'

it('renders page unchanged', () => {
    global.close = jest.fn();

    const { container } = render(<Redirect />)
    expect(container).toMatchSnapshot()
})

it('must call close window', () => {
    global.close = jest.fn();

    render(<Redirect />);
    expect(global.close).toBeCalled();
})