import PropTypes from 'prop-types';

export const Header = ({ ...rest }) => (
    <Header
        sx={{
            backgroundColor: 'background.default',
            boxShadow: 'none',
            color: 'text.primary',
            height: 64,
            zIndex: 100
        }}
        {...rest}
    />
);

Header.propTypes = {
  product: PropTypes.object.isRequired
};