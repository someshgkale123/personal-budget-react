import React from 'react';
import axios from "axios";
import { arc, pie } from "d3-shape";
import * as d3 from "d3";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";


function HomePage() {
    var [chartdata, dataSource] = useState({});
    
  let labelsnew = [];
  let datanew = [];
  let backnew = ["#ffcd56","#ff6384","#36a2eb","#fd6b19","red","purple","green","violet","brown",];
  var dataobject = {};
  
  var getBudget = () => {
    axios.get("http://localhost:4000/budget").then((res) => {
      for (var i = 0; i < res.data.myBudget.length; i++) {
        datanew[i] = res.data.myBudget[i].budget;
        labelsnew[i] = res.data.myBudget[i].title;
        dataobject[res.data.myBudget[i].title] = res.data.myBudget[i].budget;
      }
      dataSource({
        datasets: [
          {
            data: datanew,
            backgroundColor: backnew,
          },
        ],
        labels: labelsnew,
      });
      myd3(dataobject);
    });
  };

  function myd3(dataobject) {
    var width = 550;
    var height = 550;
    var margin = 60;

    
    var radius = Math.min(width, height) / 2 - margin;

    
    var svg = d3
      .select("#d3chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    
    const color = d3.scale
      .ordinal()
      .domain(labelsnew)
      .range(backnew);

    
    var pie1 = pie()
      .sort(null) 
      .value(function (d) {
        return d.value;
      });
    var data_ready = pie1(d3.entries(dataobject));

    
    var arc1 = arc()
      .innerRadius(radius * 0.3) 
      .outerRadius(radius * 0.8);

    
    var outerArc = arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    
    svg
      .selectAll("allSlices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc1)
      .attr("fill", function (d) {
         return color(d.data.key);
        
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1);

    
    svg
      .selectAll("allPolylines")
      .data(data_ready)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", function (d) {
        var posA = arc1.centroid(d); 
        var posB = outerArc.centroid(d); 
        var posC = outerArc.centroid(d); 
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; 
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); 
        return [posA, posB, posC];
      });

    
    svg
      .selectAll("allLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function (d) {
        console.log(d.data.key);
        return d.data.key;
      })
      .attr("transform", function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }

  useEffect(getBudget,[]);
  return (
    <main className="center" id="main">

        <div className="page-area">
            <script>
            
            </script>
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
            <div className="center">
            <div className="page-area">
            <div
              style={{
                height: "600px",
                width: "600px",
                display: "flex",
                alignItems: "center",
              }}>
              <Pie data={chartdata} />
            </div>
            </div>
            <div className="page-area">
              <div id="d3chart" />
            </div>
            </div>
        </div>
    </main>
  );
}

export default HomePage;
