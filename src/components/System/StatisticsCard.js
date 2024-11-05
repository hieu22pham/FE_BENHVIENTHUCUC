import React, { Component } from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default class StatisticsCard extends Component {
    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {this.props.value}
                    </Typography>
                    <Typography color="textSecondary">
                        {this.props.title}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}
