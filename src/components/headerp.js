import PropTypes from 'prop-types';

export const HeaderP = ({ ...rest }) => (
    <HeaderP
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

HeaderP.propTypes = {

};